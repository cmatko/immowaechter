/**
 * Strategy Generator für Test Healing System
 * 
 * Formatiert Claude's Antworten in strukturierte Fix-Strategien
 * und verwaltet die Strategie-Auswahl.
 */

export interface FixStrategy {
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  estimatedTime: string;
  fixes: Array<{
    file: string;
    oldCode: string;
    newCode: string;
    reason: string;
    lineNumber?: number;
  }>;
}

export interface TestFailure {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  file?: string;
  line?: number;
}

export interface HealingSession {
  sessionId: string;
  timestamp: Date;
  failures: TestFailure[];
  strategies: FixStrategy[];
  selectedStrategy?: FixStrategy;
  appliedFixes: Array<{
    file: string;
    success: boolean;
    error?: string;
  }>;
  iterations: number;
  maxIterations: number;
}

export class StrategyGenerator {
  /**
   * Parst Claude's Antwort in strukturierte Strategien
   */
  parseClaudeResponse(claudeResponse: string, failures: TestFailure[]): FixStrategy[] {
    const strategies: FixStrategy[] = [];
    
    try {
      // Versuche JSON zu parsen (falls Claude strukturiert antwortet)
      if (claudeResponse.trim().startsWith('{') || claudeResponse.trim().startsWith('[')) {
        const parsed = JSON.parse(claudeResponse);
        if (Array.isArray(parsed)) {
          return parsed.map(this.validateStrategy);
        } else if (parsed.strategies) {
          return parsed.strategies.map(this.validateStrategy);
        }
      }
      
      // Fallback: Parse aus Text-Format
      return this.parseTextResponse(claudeResponse, failures);
      
    } catch (error) {
      console.warn('⚠️  Could not parse Claude response as JSON, using text parsing');
      return this.parseTextResponse(claudeResponse, failures);
    }
  }

  /**
   * Parst Text-basierte Antwort von Claude
   */
  private parseTextResponse(text: string, failures: TestFailure[]): FixStrategy[] {
    const strategies: FixStrategy[] = [];
    
    // Suche nach Strategie-Bereichen
    const strategyRegex = /(?:Strategy|Approach|Option)\s*(\d+)[:\-]?\s*(.*?)(?=(?:Strategy|Approach|Option)\s*\d+|$)/gis;
    let match;
    
    while ((match = strategyRegex.exec(text)) !== null) {
      const strategyText = match[2];
      const strategy = this.extractStrategyFromText(strategyText, failures);
      if (strategy) {
        strategies.push(strategy);
      }
    }
    
    // Falls keine Strategien gefunden, erstelle Standard-Strategien
    if (strategies.length === 0) {
      return this.generateDefaultStrategies(failures);
    }
    
    return strategies;
  }

  /**
   * Extrahiert eine Strategie aus Text
   */
  private extractStrategyFromText(text: string, failures: TestFailure[]): FixStrategy | null {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) return null;
    
    // Extrahiere Name und Beschreibung
    const name = this.extractName(lines[0]);
    const description = this.extractDescription(lines);
    const risk = this.extractRisk(text);
    const estimatedTime = this.extractTime(text);
    
    // Extrahiere Fixes
    const fixes = this.extractFixes(text, failures);
    
    return {
      name,
      description,
      risk,
      estimatedTime,
      fixes
    };
  }

  /**
   * Extrahiert den Namen der Strategie
   */
  private extractName(firstLine: string): string {
    // Entferne Nummerierung und Formatierung
    return firstLine
      .replace(/^\d+[\.\)\-\s]*/, '')
      .replace(/^[:\-\s]*/, '')
      .trim();
  }

  /**
   * Extrahiert die Beschreibung
   */
  private extractDescription(lines: string[]): string {
    // Suche nach Beschreibungszeilen
    for (let i = 1; i < Math.min(3, lines.length); i++) {
      if (lines[i] && !lines[i].match(/^(File|Fix|Change|Risk|Time)/i)) {
        return lines[i];
      }
    }
    return 'No description available';
  }

  /**
   * Extrahiert das Risiko-Level
   */
  private extractRisk(text: string): 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('high risk') || lowerText.includes('risky') || lowerText.includes('aggressive')) {
      return 'high';
    }
    if (lowerText.includes('medium risk') || lowerText.includes('moderate')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Extrahiert die geschätzte Zeit
   */
  private extractTime(text: string): string {
    const timeMatch = text.match(/(\d+)\s*(?:min|minutes?|hours?|hrs?)/i);
    if (timeMatch) {
      return timeMatch[0];
    }
    return 'Unknown';
  }

  /**
   * Extrahiert Fixes aus dem Text
   */
  private extractFixes(text: string, failures: TestFailure[]): FixStrategy['fixes'] {
    const fixes: FixStrategy['fixes'] = [];
    
    // Suche nach Code-Blöcken
    const codeBlockRegex = /```(?:typescript|tsx?|javascript|jsx?)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const code = match[1].trim();
      const fix = this.parseCodeBlock(code, failures);
      if (fix) {
        fixes.push(fix);
      }
    }
    
    return fixes;
  }

  /**
   * Parst einen Code-Block
   */
  private parseCodeBlock(code: string, failures: TestFailure[]): FixStrategy['fixes'][0] | null {
    const lines = code.split('\n');
    
    // Suche nach Dateiname
    const fileMatch = code.match(/\/\/\s*File:\s*(.+)/i) || 
                     code.match(/\/\*\s*File:\s*(.+)\s*\*\//i);
    
    if (!fileMatch) return null;
    
    const file = fileMatch[1].trim();
    
    // Suche nach Grund
    const reasonMatch = code.match(/\/\/\s*Reason:\s*(.+)/i) ||
                       code.match(/\/\*\s*Reason:\s*(.+)\s*\*\//i);
    
    const reason = reasonMatch ? reasonMatch[1].trim() : 'No reason provided';
    
    // Versuche old/new Code zu extrahieren
    const oldNewMatch = code.match(/\/\/\s*OLD:\s*([\s\S]*?)\/\/\s*NEW:\s*([\s\S]*)/i);
    
    if (oldNewMatch) {
      return {
        file,
        oldCode: oldNewMatch[1].trim(),
        newCode: oldNewMatch[2].trim(),
        reason
      };
    }
    
    // Fallback: Verwende den gesamten Code als newCode
    return {
      file,
      oldCode: '',
      newCode: code,
      reason
    };
  }

  /**
   * Validiert eine Strategie
   */
  private validateStrategy(strategy: any): FixStrategy {
    return {
      name: strategy.name || 'Unnamed Strategy',
      description: strategy.description || 'No description',
      risk: strategy.risk || 'low',
      estimatedTime: strategy.estimatedTime || 'Unknown',
      fixes: strategy.fixes || []
    };
  }

  /**
   * Generiert Standard-Strategien falls Parsing fehlschlägt
   */
  private generateDefaultStrategies(failures: TestFailure[]): FixStrategy[] {
    return [
      {
        name: 'Conservative Fix',
        description: 'Minimal changes to fix test failures',
        risk: 'low',
        estimatedTime: '10-15 min',
        fixes: failures.map(failure => ({
          file: failure.file || 'unknown',
          oldCode: '',
          newCode: `// Fix for ${failure.testName}`,
          reason: `Fix test failure: ${failure.errorMessage}`
        }))
      },
      {
        name: 'Aggressive Refactor',
        description: 'Comprehensive refactoring for better testability',
        risk: 'high',
        estimatedTime: '30-45 min',
        fixes: []
      },
      {
        name: 'Hybrid Approach',
        description: 'Balanced approach with moderate changes',
        risk: 'medium',
        estimatedTime: '20-30 min',
        fixes: []
      }
    ];
  }

  /**
   * Zeigt verfügbare Strategien an
   */
  displayStrategies(strategies: FixStrategy[]): void {
    console.log('\n📋 AVAILABLE FIX STRATEGIES');
    console.log('='.repeat(60));
    
    strategies.forEach((strategy, index) => {
      const riskColor = this.getRiskColor(strategy.risk);
      const riskIcon = this.getRiskIcon(strategy.risk);
      
      console.log(`\n${index + 1}. ${strategy.name}`);
      console.log(`   ${strategy.description}`);
      console.log(`   ${riskIcon} Risk: ${riskColor}${strategy.risk.toUpperCase()}${this.resetColor()}`);
      console.log(`   ⏱️  Time: ${strategy.estimatedTime}`);
      console.log(`   🔧 Fixes: ${strategy.fixes.length} changes`);
      
      if (strategy.fixes.length > 0) {
        console.log(`   📁 Files: ${[...new Set(strategy.fixes.map(f => f.file))].join(', ')}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Wählt eine Strategie basierend auf Benutzereingabe
   */
  async selectStrategy(strategies: FixStrategy[]): Promise<FixStrategy | null> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      const askForChoice = () => {
        rl.question('\n👉 Choose strategy [1-3] or [q]uit: ', (answer) => {
          const choice = answer.trim().toLowerCase();
          
          if (choice === 'q' || choice === 'quit') {
            rl.close();
            resolve(null);
            return;
          }
          
          const index = parseInt(choice) - 1;
          if (index >= 0 && index < strategies.length) {
            rl.close();
            resolve(strategies[index]);
          } else {
            console.log('❌ Invalid choice. Please enter 1-3 or q to quit.');
            askForChoice();
          }
        });
      };
      
      askForChoice();
    });
  }

  /**
   * Erstellt eine neue Healing Session
   */
  createSession(failures: TestFailure[]): HealingSession {
    return {
      sessionId: this.generateSessionId(),
      timestamp: new Date(),
      failures,
      strategies: [],
      appliedFixes: [],
      iterations: 0,
      maxIterations: 3
    };
  }

  /**
   * Generiert eine Session-ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gibt Risiko-Farbe zurück
   */
  private getRiskColor(risk: string): string {
    switch (risk) {
      case 'high': return '\x1b[31m'; // Red
      case 'medium': return '\x1b[33m'; // Yellow
      case 'low': return '\x1b[32m'; // Green
      default: return '\x1b[37m'; // White
    }
  }

  /**
   * Gibt Risiko-Icon zurück
   */
  private getRiskIcon(risk: string): string {
    switch (risk) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  /**
   * Reset-Farbe
   */
  private resetColor(): string {
    return '\x1b[0m';
  }
}

export default StrategyGenerator;
