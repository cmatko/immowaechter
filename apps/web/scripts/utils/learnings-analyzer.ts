/**
 * Learnings Analyzer für Test Healing System
 * 
 * Analysiert Healing-Sessions um Patterns zu erkennen
 * und schlägt Linear Tasks basierend auf den Erkenntnissen vor.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { HealingSession } from './strategy-generator';

export interface SessionLearning {
  sessionId: string;
  timestamp: Date;
  
  // Pattern Detection
  recurringPatterns: Array<{
    pattern: string;
    occurrences: number;
    files: string[];
    suggestedAction: string;
  }>;
  
  // Test Coverage Gaps
  testGaps: Array<{
    area: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // Tech Debt
  techDebtOpportunities: Array<{
    type: 'refactor' | 'optimize' | 'standardize';
    description: string;
    impact: string;
    effort: string;
  }>;
  
  // Linear Task Suggestions
  suggestedTasks: LinearTaskSuggestion[];
}

export interface LinearTaskSuggestion {
  title: string;
  description: string; // Full markdown description
  priority: 1 | 2 | 3 | 4; // Urgent, High, Medium, Low
  labels: string[]; // e.g., ['testing', 'refactor', 'tech-debt']
  reasoning: string; // Why this task is suggested
  estimatedTime: string; // e.g., "2-3 hours"
  dependencies?: string[]; // Other task IDs if applicable
}

export interface LinearTaskInput {
  title: string;
  description: string;
  priority: number;
  labels: string[];
  team: string;
  project?: string;
}

export class LearningsAnalyzer {
  private sessionsDir: string;
  private learningsDir: string;

  constructor() {
    this.sessionsDir = path.join(process.cwd(), '.test-healing', 'sessions');
    this.learningsDir = path.join(process.cwd(), '.test-healing', 'learnings');
  }

  /**
   * Analysiert eine einzelne Session
   */
  async analyzeSession(sessionId: string): Promise<SessionLearning> {
    const sessionFile = path.join(this.sessionsDir, `${sessionId}.json`);
    
    try {
      const sessionData = await fs.readFile(sessionFile, 'utf-8');
      const session: HealingSession = JSON.parse(sessionData);
      
      return this.analyzeSessionData(session);
    } catch (error) {
      throw new Error(`Failed to analyze session ${sessionId}: ${error}`);
    }
  }

  /**
   * Analysiert alle Sessions und erstellt aggregierte Learnings
   */
  async analyzeAllSessions(): Promise<SessionLearning[]> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      const sessionFiles = files.filter(file => file.endsWith('.json'));
      
      const sessions: SessionLearning[] = [];
      
      for (const file of sessionFiles) {
        const sessionId = file.replace('.json', '');
        try {
          const learning = await this.analyzeSession(sessionId);
          sessions.push(learning);
        } catch (error) {
          console.warn(`⚠️  Could not analyze session ${sessionId}: ${error}`);
        }
      }
      
      return sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      throw new Error(`Failed to analyze sessions: ${error}`);
    }
  }

  /**
   * Analysiert Session-Daten
   */
  private analyzeSessionData(session: HealingSession): SessionLearning {
    const recurringPatterns = this.detectPatterns(session);
    const testGaps = this.identifyTestGaps(session);
    const techDebtOpportunities = this.identifyTechDebt(session);
    const suggestedTasks = this.suggestTasks(session, recurringPatterns, testGaps, techDebtOpportunities);
    
    return {
      sessionId: session.sessionId,
      timestamp: session.timestamp,
      recurringPatterns,
      testGaps,
      techDebtOpportunities,
      suggestedTasks
    };
  }

  /**
   * Erkennt wiederkehrende Patterns
   */
  private detectPatterns(session: HealingSession): SessionLearning['recurringPatterns'] {
    const patterns: SessionLearning['recurringPatterns'] = [];
    
    // Pattern 1: Same File Modified Multiple Times
    const fileModificationCounts = new Map<string, number>();
    session.appliedFixes.forEach(fix => {
      const count = fileModificationCounts.get(fix.file) || 0;
      fileModificationCounts.set(fix.file, count + 1);
    });
    
    fileModificationCounts.forEach((count, file) => {
      if (count > 1) {
        patterns.push({
          pattern: `File ${file} modified ${count} times`,
          occurrences: count,
          files: [file],
          suggestedAction: `Refactor ${file} for better testability`
        });
      }
    });
    
    // Pattern 2: Recurring Error Types
    const errorTypes = new Map<string, number>();
    session.failures.forEach(failure => {
      const errorType = this.categorizeError(failure.errorMessage);
      const count = errorTypes.get(errorType) || 0;
      errorTypes.set(errorType, count + 1);
    });
    
    errorTypes.forEach((count, errorType) => {
      if (count > 1) {
        patterns.push({
          pattern: `${errorType} error occurred ${count} times`,
          occurrences: count,
          files: [],
          suggestedAction: `Add systematic handling for ${errorType} errors`
        });
      }
    });
    
    return patterns;
  }

  /**
   * Kategorisiert Fehlertypen
   */
  private categorizeError(errorMessage: string): string {
    const lowerError = errorMessage.toLowerCase();
    
    if (lowerError.includes('data-testid') || lowerError.includes('selector')) {
      return 'Selector Issues';
    }
    if (lowerError.includes('timeout') || lowerError.includes('wait')) {
      return 'Timeout Issues';
    }
    if (lowerError.includes('network') || lowerError.includes('fetch')) {
      return 'Network Issues';
    }
    if (lowerError.includes('auth') || lowerError.includes('login')) {
      return 'Authentication Issues';
    }
    if (lowerError.includes('permission') || lowerError.includes('access')) {
      return 'Permission Issues';
    }
    
    return 'Other';
  }

  /**
   * Identifiziert Test Coverage Gaps
   */
  private identifyTestGaps(session: HealingSession): SessionLearning['testGaps'] {
    const gaps: SessionLearning['testGaps'] = [];
    
    // Analysiere Fehler um Coverage-Gaps zu identifizieren
    session.failures.forEach(failure => {
      if (failure.errorMessage.includes('not found') || failure.errorMessage.includes('missing')) {
        gaps.push({
          area: failure.testName,
          reason: 'Component or element not found in tests',
          priority: 'high'
        });
      }
      
      if (failure.errorMessage.includes('error') || failure.errorMessage.includes('exception')) {
        gaps.push({
          area: failure.testName,
          reason: 'Error handling not tested',
          priority: 'medium'
        });
      }
    });
    
    return gaps;
  }

  /**
   * Identifiziert Tech Debt Opportunities
   */
  private identifyTechDebt(session: HealingSession): SessionLearning['techDebtOpportunities'] {
    const opportunities: SessionLearning['techDebtOpportunities'] = [];
    
    // Refactoring Opportunities
    const fileModificationCounts = new Map<string, number>();
    session.appliedFixes.forEach(fix => {
      const count = fileModificationCounts.get(fix.file) || 0;
      fileModificationCounts.set(fix.file, count + 1);
    });
    
    fileModificationCounts.forEach((count, file) => {
      if (count > 2) {
        opportunities.push({
          type: 'refactor',
          description: `Refactor ${file} for better maintainability`,
          impact: 'Reduces test fragility',
          effort: '2-4 hours'
        });
      }
    });
    
    // Standardization Opportunities
    const selectorIssues = session.failures.filter(f => 
      f.errorMessage.toLowerCase().includes('data-testid') || 
      f.errorMessage.toLowerCase().includes('selector')
    );
    
    if (selectorIssues.length > 0) {
      opportunities.push({
        type: 'standardize',
        description: 'Standardize data-testid naming convention',
        impact: 'Improves test stability',
        effort: '1-2 hours'
      });
    }
    
    return opportunities;
  }

  /**
   * Schlägt Linear Tasks vor
   */
  private suggestTasks(
    session: HealingSession,
    patterns: SessionLearning['recurringPatterns'],
    gaps: SessionLearning['testGaps'],
    techDebt: SessionLearning['techDebtOpportunities']
  ): LinearTaskSuggestion[] {
    const tasks: LinearTaskSuggestion[] = [];
    
    // Tasks basierend auf Patterns
    patterns.forEach(pattern => {
      if (pattern.occurrences > 1) {
        tasks.push({
          title: pattern.suggestedAction,
          description: `**Problem**: ${pattern.pattern}\n\n**Solution**: ${pattern.suggestedAction}\n\n**Files affected**: ${pattern.files.join(', ')}\n\n**Priority**: High - Recurring issue affecting ${pattern.occurrences} occurrences`,
          priority: 2, // High
          labels: ['testing', 'refactor', 'tech-debt'],
          reasoning: `Recurring pattern detected: ${pattern.pattern}`,
          estimatedTime: '2-3 hours'
        });
      }
    });
    
    // Tasks basierend auf Test Gaps
    gaps.forEach(gap => {
      if (gap.priority === 'high') {
        tasks.push({
          title: `Add test coverage for ${gap.area}`,
          description: `**Coverage Gap**: ${gap.area}\n\n**Reason**: ${gap.reason}\n\n**Priority**: High - Missing critical test coverage`,
          priority: 2, // High
          labels: ['testing', 'coverage'],
          reasoning: `Test coverage gap identified: ${gap.reason}`,
          estimatedTime: '1-2 hours'
        });
      }
    });
    
    // Tasks basierend auf Tech Debt
    techDebt.forEach(debt => {
      tasks.push({
        title: debt.description,
        description: `**Type**: ${debt.type}\n\n**Impact**: ${debt.impact}\n\n**Effort**: ${debt.effort}\n\n**Priority**: ${debt.type === 'refactor' ? 'Medium' : 'Low'}`,
        priority: debt.type === 'refactor' ? 3 : 4, // Medium or Low
        labels: ['tech-debt', debt.type],
        reasoning: `Tech debt opportunity: ${debt.description}`,
        estimatedTime: debt.effort
      });
    });
    
    return tasks;
  }

  /**
   * Formatiert Task für Linear API
   */
  formatTaskForLinear(suggestion: LinearTaskSuggestion): LinearTaskInput {
    return {
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      labels: suggestion.labels,
      team: 'Kotto',
      project: 'ImmoWächter'
    };
  }

  /**
   * Speichert Learnings
   */
  async saveLearnings(learning: SessionLearning): Promise<void> {
    const learningFile = path.join(this.learningsDir, `${learning.sessionId}.json`);
    await fs.writeFile(learningFile, JSON.stringify(learning, null, 2));
  }

  /**
   * Lädt alle Learnings
   */
  async loadAllLearnings(): Promise<SessionLearning[]> {
    try {
      const files = await fs.readdir(this.learningsDir);
      const learningFiles = files.filter(file => file.endsWith('.json'));
      
      const learnings: SessionLearning[] = [];
      
      for (const file of learningFiles) {
        const learningFile = path.join(this.learningsDir, file);
        const content = await fs.readFile(learningFile, 'utf-8');
        const learning = JSON.parse(content);
        learnings.push(learning);
      }
      
      return learnings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.warn(`⚠️  Could not load learnings: ${error}`);
      return [];
    }
  }

  /**
   * Zeigt Learnings-Zusammenfassung
   */
  displayLearnings(learnings: SessionLearning[]): void {
    console.log('\n🧠 LEARNINGS SUMMARY');
    console.log('='.repeat(60));
    
    learnings.forEach(learning => {
      console.log(`\n📊 Session: ${learning.sessionId}`);
      console.log(`   Date: ${learning.timestamp.toISOString()}`);
      console.log(`   Patterns: ${learning.recurringPatterns.length}`);
      console.log(`   Test Gaps: ${learning.testGaps.length}`);
      console.log(`   Tech Debt: ${learning.techDebtOpportunities.length}`);
      console.log(`   Suggested Tasks: ${learning.suggestedTasks.length}`);
    });
    
    console.log('\n' + '='.repeat(60));
  }
}

export default LearningsAnalyzer;
