#!/usr/bin/env tsx

/**
 * Analyze Learnings Script
 * 
 * Analysiert alle gespeicherten Learnings und zeigt
 * eine Übersicht der erkannten Patterns und Vorschläge.
 * 
 * Usage:
 *   npm run test:analyze-learnings
 *   npm run test:analyze-learnings -- --session=session_123
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import LearningsAnalyzer, { SessionLearning } from './utils/learnings-analyzer';

interface AnalysisOptions {
  sessionId?: string;
  verbose?: boolean;
  export?: boolean;
}

class LearningsAnalyzerCLI {
  private analyzer: LearningsAnalyzer;
  private options: AnalysisOptions;

  constructor(options: AnalysisOptions = {}) {
    this.analyzer = new LearningsAnalyzer();
    this.options = {
      verbose: false,
      export: false,
      ...options
    };
  }

  /**
   * Haupt-Einstiegspunkt
   */
  async analyzeLearnings(): Promise<void> {
    try {
      console.log('🧠 Analyzing Test Healing Learnings...\n');
      
      // Lade Learnings
      const learnings = await this.loadLearnings();
      
      if (learnings.length === 0) {
        console.log('❌ No learnings found. Run test healing first.');
        return;
      }
      
      // Zeige Übersicht
      this.displayOverview(learnings);
      
      // Analysiere Patterns
      const aggregatedPatterns = this.aggregatePatterns(learnings);
      this.displayPatterns(aggregatedPatterns);
      
      // Analysiere Test Gaps
      const aggregatedGaps = this.aggregateTestGaps(learnings);
      this.displayTestGaps(aggregatedGaps);
      
      // Analysiere Tech Debt
      const aggregatedTechDebt = this.aggregateTechDebt(learnings);
      this.displayTechDebt(aggregatedTechDebt);
      
      // Zeige Task-Vorschläge
      const allTasks = this.aggregateTasks(learnings);
      this.displayTaskSuggestions(allTasks);
      
      // Export falls gewünscht
      if (this.options.export) {
        await this.exportAnalysis(learnings, aggregatedPatterns, aggregatedGaps, aggregatedTechDebt, allTasks);
      }
      
    } catch (error) {
      console.error('❌ Error analyzing learnings:', error);
      process.exit(1);
    }
  }

  /**
   * Lädt Learnings
   */
  private async loadLearnings(): Promise<SessionLearning[]> {
    if (this.options.sessionId) {
      const learning = await this.analyzer.analyzeSession(this.options.sessionId);
      return [learning];
    }
    
    return await this.analyzer.loadAllLearnings();
  }

  /**
   * Zeigt Übersicht der Learnings
   */
  private displayOverview(learnings: SessionLearning[]): void {
    console.log('📊 LEARNINGS OVERVIEW');
    console.log('='.repeat(60));
    
    console.log(`Total Sessions: ${learnings.length}`);
    console.log(`Date Range: ${learnings[learnings.length - 1]?.timestamp.toISOString()} to ${learnings[0]?.timestamp.toISOString()}`);
    
    const totalPatterns = learnings.reduce((sum, l) => sum + l.recurringPatterns.length, 0);
    const totalGaps = learnings.reduce((sum, l) => sum + l.testGaps.length, 0);
    const totalTechDebt = learnings.reduce((sum, l) => sum + l.techDebtOpportunities.length, 0);
    const totalTasks = learnings.reduce((sum, l) => sum + l.suggestedTasks.length, 0);
    
    console.log(`Total Patterns: ${totalPatterns}`);
    console.log(`Total Test Gaps: ${totalGaps}`);
    console.log(`Total Tech Debt: ${totalTechDebt}`);
    console.log(`Total Suggested Tasks: ${totalTasks}`);
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Aggregiert Patterns über alle Sessions
   */
  private aggregatePatterns(learnings: SessionLearning[]): Map<string, { count: number; sessions: string[]; files: string[] }> {
    const patterns = new Map<string, { count: number; sessions: string[]; files: string[] }>();
    
    learnings.forEach(learning => {
      learning.recurringPatterns.forEach(pattern => {
        const key = pattern.pattern;
        const existing = patterns.get(key) || { count: 0, sessions: [], files: [] };
        
        existing.count += pattern.occurrences;
        existing.sessions.push(learning.sessionId);
        existing.files.push(...pattern.files);
        
        patterns.set(key, existing);
      });
    });
    
    return patterns;
  }

  /**
   * Zeigt aggregierte Patterns
   */
  private displayPatterns(patterns: Map<string, { count: number; sessions: string[]; files: string[] }>): void {
    console.log('\n🔍 RECURRING PATTERNS');
    console.log('='.repeat(60));
    
    if (patterns.size === 0) {
      console.log('✅ No recurring patterns detected');
      return;
    }
    
    // Sortiere nach Häufigkeit
    const sortedPatterns = Array.from(patterns.entries())
      .sort(([, a], [, b]) => b.count - a.count);
    
    sortedPatterns.forEach(([pattern, data]) => {
      console.log(`\n📊 ${pattern}`);
      console.log(`   Occurrences: ${data.count}`);
      console.log(`   Sessions: ${data.sessions.length}`);
      console.log(`   Files: ${[...new Set(data.files)].join(', ')}`);
    });
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Aggregiert Test Gaps
   */
  private aggregateTestGaps(learnings: SessionLearning[]): Map<string, { count: number; priority: string; sessions: string[] }> {
    const gaps = new Map<string, { count: number; priority: string; sessions: string[] }>();
    
    learnings.forEach(learning => {
      learning.testGaps.forEach(gap => {
        const key = gap.area;
        const existing = gaps.get(key) || { count: 0, priority: gap.priority, sessions: [] };
        
        existing.count++;
        existing.sessions.push(learning.sessionId);
        
        gaps.set(key, existing);
      });
    });
    
    return gaps;
  }

  /**
   * Zeigt Test Gaps
   */
  private displayTestGaps(gaps: Map<string, { count: number; priority: string; sessions: string[] }>): void {
    console.log('\n🕳️  TEST COVERAGE GAPS');
    console.log('='.repeat(60));
    
    if (gaps.size === 0) {
      console.log('✅ No test coverage gaps detected');
      return;
    }
    
    const sortedGaps = Array.from(gaps.entries())
      .sort(([, a], [, b]) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      });
    
    sortedGaps.forEach(([area, data]) => {
      const priorityIcon = data.priority === 'high' ? '🔴' : data.priority === 'medium' ? '🟡' : '🟢';
      console.log(`\n${priorityIcon} ${area}`);
      console.log(`   Priority: ${data.priority.toUpperCase()}`);
      console.log(`   Occurrences: ${data.count}`);
      console.log(`   Sessions: ${data.sessions.length}`);
    });
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Aggregiert Tech Debt
   */
  private aggregateTechDebt(learnings: SessionLearning[]): Map<string, { count: number; type: string; sessions: string[] }> {
    const techDebt = new Map<string, { count: number; type: string; sessions: string[] }>();
    
    learnings.forEach(learning => {
      learning.techDebtOpportunities.forEach(debt => {
        const key = debt.description;
        const existing = techDebt.get(key) || { count: 0, type: debt.type, sessions: [] };
        
        existing.count++;
        existing.sessions.push(learning.sessionId);
        
        techDebt.set(key, existing);
      });
    });
    
    return techDebt;
  }

  /**
   * Zeigt Tech Debt
   */
  private displayTechDebt(techDebt: Map<string, { count: number; type: string; sessions: string[] }>): void {
    console.log('\n🔧 TECH DEBT OPPORTUNITIES');
    console.log('='.repeat(60));
    
    if (techDebt.size === 0) {
      console.log('✅ No tech debt opportunities detected');
      return;
    }
    
    const sortedTechDebt = Array.from(techDebt.entries())
      .sort(([, a], [, b]) => b.count - a.count);
    
    sortedTechDebt.forEach(([description, data]) => {
      const typeIcon = data.type === 'refactor' ? '🔄' : data.type === 'optimize' ? '⚡' : '📏';
      console.log(`\n${typeIcon} ${description}`);
      console.log(`   Type: ${data.type}`);
      console.log(`   Occurrences: ${data.count}`);
      console.log(`   Sessions: ${data.sessions.length}`);
    });
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Aggregiert Task-Vorschläge
   */
  private aggregateTasks(learnings: SessionLearning[]): Array<{ task: any; count: number; sessions: string[] }> {
    const taskMap = new Map<string, { task: any; count: number; sessions: string[] }>();
    
    learnings.forEach(learning => {
      learning.suggestedTasks.forEach(task => {
        const key = task.title;
        const existing = taskMap.get(key) || { task, count: 0, sessions: [] };
        
        existing.count++;
        existing.sessions.push(learning.sessionId);
        
        taskMap.set(key, existing);
      });
    });
    
    return Array.from(taskMap.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Zeigt Task-Vorschläge
   */
  private displayTaskSuggestions(tasks: Array<{ task: any; count: number; sessions: string[] }>): void {
    console.log('\n💡 SUGGESTED LINEAR TASKS');
    console.log('='.repeat(60));
    
    if (tasks.length === 0) {
      console.log('✅ No task suggestions available');
      return;
    }
    
    tasks.forEach(({ task, count, sessions }) => {
      const priorityIcon = this.getPriorityIcon(task.priority);
      console.log(`\n${priorityIcon} ${task.title}`);
      console.log(`   Priority: ${this.getPriorityText(task.priority)}`);
      console.log(`   Labels: ${task.labels.join(', ')}`);
      console.log(`   Time: ${task.estimatedTime}`);
      console.log(`   Suggested: ${count} times`);
      console.log(`   Sessions: ${sessions.length}`);
      
      if (this.options.verbose) {
        console.log(`   Reasoning: ${task.reasoning}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Exportiert Analyse-Ergebnisse
   */
  private async exportAnalysis(
    learnings: SessionLearning[],
    patterns: Map<string, any>,
    gaps: Map<string, any>,
    techDebt: Map<string, any>,
    tasks: Array<{ task: any; count: number; sessions: string[] }>
  ): Promise<void> {
    const exportFile = path.join(process.cwd(), '.test-healing', 'analysis-export.json');
    
    const analysis = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSessions: learnings.length,
        totalPatterns: patterns.size,
        totalGaps: gaps.size,
        totalTechDebt: techDebt.size,
        totalTasks: tasks.length
      },
      patterns: Object.fromEntries(patterns),
      gaps: Object.fromEntries(gaps),
      techDebt: Object.fromEntries(techDebt),
      tasks: tasks.map(({ task, count, sessions }) => ({
        ...task,
        suggestedCount: count,
        sessions
      }))
    };
    
    await fs.writeFile(exportFile, JSON.stringify(analysis, null, 2));
    console.log(`\n📁 Analysis exported to: ${exportFile}`);
  }

  /**
   * Gibt Priority-Icon zurück
   */
  private getPriorityIcon(priority: number): string {
    switch (priority) {
      case 1: return '🔴'; // Urgent
      case 2: return '🟠'; // High
      case 3: return '🟡'; // Medium
      case 4: return '🟢'; // Low
      default: return '⚪';
    }
  }

  /**
   * Gibt Priority-Text zurück
   */
  private getPriorityText(priority: number): string {
    switch (priority) {
      case 1: return 'Urgent';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      default: return 'Unknown';
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options: AnalysisOptions = {
    sessionId: args.find(arg => arg.startsWith('--session='))?.split('=')[1],
    verbose: args.includes('--verbose'),
    export: args.includes('--export')
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🧠 Analyze Test Healing Learnings

Usage:
  npm run test:analyze-learnings
  npm run test:analyze-learnings -- --session=session_123
  npm run test:analyze-learnings -- --export

Options:
  --session=ID    Analyze specific session only
  --verbose       Show detailed output
  --export        Export analysis to JSON file
  --help, -h      Show this help message
`);
    process.exit(0);
  }
  
  const analyzer = new LearningsAnalyzerCLI(options);
  await analyzer.analyzeLearnings();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { LearningsAnalyzerCLI };
