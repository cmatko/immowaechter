#!/usr/bin/env tsx

/**
 * Interactive Test Healing Script für ImmoWächter
 * 
 * Haupt-Script für das Self-Healing Test System:
 * 1. Führt Tests aus und erkennt Fehler
 * 2. Verwendet Claude API für 3 Fix-Strategien
 * 3. Zeigt Diffs zur Benutzerfreigabe
 * 4. Wendet genehmigte Fixes mit Backups an
 * 5. Führt Tests erneut aus (max 3 Iterationen)
 * 6. Extrahiert Learnings und schlägt Linear Tasks vor
 * 
 * Usage:
 *   npm run test:interactive
 *   npm run test:interactive -- --verbose
 *   npm run test:interactive -- --dry-run
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import ora from 'ora';
import DiffViewer, { CodeChange } from './utils/diff-viewer';
import StrategyGenerator, { FixStrategy, TestFailure, HealingSession } from './utils/strategy-generator';
import { colors, status, header } from './utils/colors';

const execAsync = promisify(exec);

interface HealingOptions {
  verbose?: boolean;
  dryRun?: boolean;
  maxIterations?: number;
}

class InteractiveHealer {
  private anthropic: Anthropic;
  private diffViewer: DiffViewer;
  private strategyGenerator: StrategyGenerator;
  private options: HealingOptions;
  private session: HealingSession | null = null;

  constructor(options: HealingOptions = {}) {
    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      if (options.dryRun) {
        console.warn('⚠️  ANTHROPIC_API_KEY not found - running in dry-run mode');
        console.warn('   To use real healing, set ANTHROPIC_API_KEY environment variable');
        this.anthropic = null as any;
      } else {
        throw new Error('ANTHROPIC_API_KEY environment variable is required');
      }
    } else {
      this.anthropic = new Anthropic({
        apiKey: apiKey,
      });
    }
    
    this.diffViewer = new DiffViewer({ colorize: true });
    this.strategyGenerator = new StrategyGenerator();
    this.options = {
      verbose: false,
      dryRun: false,
      maxIterations: 3,
      ...options
    };
  }

  /**
   * Haupt-Einstiegspunkt
   */
  async startHealing(): Promise<void> {
    try {
      console.log(header.main('🧪 INTERACTIVE TEST HEALING'));
      
      // Step 1: Run Tests
      const failures = await this.runTests();
      
      if (failures.length === 0) {
        console.log(status.success('All tests are passing! No healing needed.'));
        return;
      }
      
      console.log(status.error(`Found ${failures.length} test failures`));
      
      // Create session
      this.session = this.strategyGenerator.createSession(failures);
      
      // Step 2: Analyze failures with Claude
      const strategies = await this.analyzeFailures(failures);
      this.session.strategies = strategies;
      
      // Step 3: Strategy selection
      const selectedStrategy = await this.strategyGenerator.selectStrategy(strategies);
      if (!selectedStrategy) {
        console.log(status.info('Healing cancelled by user'));
        return;
      }
      
      this.session.selectedStrategy = selectedStrategy;
      console.log(colors.bold(`\n🎯 Selected strategy: ${selectedStrategy.name}`));
      
      // Step 4: Apply fixes
      await this.applyFixes(selectedStrategy);
      
      // Step 5: Re-run tests
      await this.rerunTests();
      
      // Step 6: Extract learnings
      await this.extractLearnings();
      
      // Step 7: Show summary
      this.showSummary();
      
    } catch (error) {
      console.error(status.error('Error during healing process:'), error);
      process.exit(1);
    }
  }

  /**
   * Führt Tests aus und erkennt Fehler
   */
  private async runTests(): Promise<TestFailure[]> {
    console.log(header.sub('🧪 RUNNING TESTS'));
    const spinner = ora('Running Playwright tests...').start();
    
    try {
      const { stdout, stderr } = await execAsync('npx playwright test');
      
      if (this.options.verbose) {
        console.log('Test output:', stdout);
      }
      
      // Alle Tests bestanden
      spinner.succeed(colors.success('All tests passed!'));
      return [];
      
    } catch (error: any) {
      // Tests fehlgeschlagen - parse Fehler
      const output = error.stdout || error.stderr || '';
      const failures = this.parseTestFailures(output);
      
      if (failures.length > 0) {
        spinner.fail(colors.error(`${failures.length} tests failed`));
      } else {
        spinner.fail(colors.error('Test execution failed'));
      }
      
      return failures;
    }
  }

  /**
   * Parst Test-Fehler aus der Ausgabe
   */
  private parseTestFailures(output: string): TestFailure[] {
    const failures: TestFailure[] = [];
    
    // Suche nach Test-Fehlern
    const testFailureRegex = /Error:\s*(.+?)(?=\n\s*at|\n\s*Error:|\n\s*$)/gs;
    let match;
    
    while ((match = testFailureRegex.exec(output)) !== null) {
      const errorMessage = match[1].trim();
      
      // Extrahiere Test-Name aus der Ausgabe
      const testNameMatch = output.match(/Running\s+(.+?)\s*\.\.\./);
      const testName = testNameMatch ? testNameMatch[1] : 'Unknown Test';
      
      failures.push({
        testName,
        errorMessage,
        stackTrace: output.substring(match.index, match.index + 500)
      });
    }
    
    // Fallback: Erstelle einen generischen Fehler
    if (failures.length === 0 && output.includes('Error')) {
      failures.push({
        testName: 'Test Suite',
        errorMessage: 'Tests failed - see output for details',
        stackTrace: output
      });
    }
    
    return failures;
  }

  /**
   * Analysiert Fehler mit Claude API
   */
  private async analyzeFailures(failures: TestFailure[]): Promise<FixStrategy[]> {
    console.log(header.sub('🤖 ANALYZING FAILURES WITH CLAUDE'));
    
    // Dry-run mode if no API key
    if (!this.anthropic) {
      return this.generateMockStrategies(failures);
    }
    
    const spinner = ora({
      text: 'Waiting for Claude API response...',
      color: 'cyan'
    }).start();
    
    const systemPrompt = `Du bist ein Experte für Playwright E2E Tests und Next.js 14 App Router.
    
Generiere 3 verschiedene Fix-Strategien für die gegebenen Test-Fehler:

1. **Conservative (Low Risk)**: Minimale Änderungen, nur notwendige Fixes
2. **Aggressive (High Risk)**: Umfassende Refaktorierung für bessere Testbarkeit  
3. **Hybrid (Medium Risk)**: Ausgewogener Ansatz mit moderaten Änderungen

Für jede Strategie:
- Beschreibe den Ansatz
- Schätze das Risiko (low/medium/high)
- Schätze die Zeit (z.B. "15-20 min")
- Liste spezifische Fixes mit Dateinamen und Code-Änderungen

Format: Strukturierte Antwort mit klaren Strategie-Bereichen.`;

    const userPrompt = `Analysiere diese Test-Fehler und generiere 3 Fix-Strategien:

${failures.map((failure, index) => `
**Fehler ${index + 1}:**
- Test: ${failure.testName}
- Fehler: ${failure.errorMessage}
- Stack Trace: ${failure.stackTrace.substring(0, 200)}...
`).join('\n')}

Generiere 3 verschiedene Strategien mit spezifischen Code-Fixes.`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Parse strategies from Claude response
      const strategies = this.strategyGenerator.parseClaudeResponse(content.text, failures);
      
      spinner.succeed(colors.success('Analysis complete!'));
      console.log(colors.info(`Generated ${strategies.length} fix strategies`));
      return strategies;
      
    } catch (error) {
      spinner.fail(colors.error('Analysis failed'));
      console.error(status.error('Error calling Claude API:'), error);
      throw new Error(`Failed to analyze failures: ${error}`);
    }
  }

  /**
   * Generiert Mock-Strategien für Dry-Run
   */
  private generateMockStrategies(failures: TestFailure[]): FixStrategy[] {
    return [
      {
        name: 'Conservative Fix (Mock)',
        description: 'Minimal changes to fix test failures',
        risk: 'low',
        estimatedTime: '10-15 min',
        fixes: failures.map(failure => ({
          file: failure.file || 'unknown',
          oldCode: '',
          newCode: `// Fix for ${failure.testName}`,
          reason: `Mock fix for: ${failure.errorMessage}`
        }))
      },
      {
        name: 'Aggressive Refactor (Mock)',
        description: 'Comprehensive refactoring for better testability',
        risk: 'high',
        estimatedTime: '30-45 min',
        fixes: []
      },
      {
        name: 'Hybrid Approach (Mock)',
        description: 'Balanced approach with moderate changes',
        risk: 'medium',
        estimatedTime: '20-30 min',
        fixes: []
      }
    ];
  }

  /**
   * Wendet Fixes an
   */
  private async applyFixes(strategy: FixStrategy): Promise<void> {
    console.log(header.sub(`🔧 APPLYING FIXES FROM ${strategy.name.toUpperCase()}`));
    
    if (strategy.fixes.length === 0) {
      console.log(status.warning('No fixes to apply'));
      return;
    }
    
    // Zeige Zusammenfassung
    this.diffViewer.displayChangeSummary(strategy.fixes);
    
    // Wende jeden Fix an
    for (let i = 0; i < strategy.fixes.length; i++) {
      const fix = strategy.fixes[i];
      console.log('\n' + colors.bold(`📝 Fix ${i + 1}/${strategy.fixes.length}: ${fix.file}`));
      console.log(colors.dim(`   Reason: ${fix.reason}`));
      
      if (this.options.dryRun) {
        console.log(status.info('DRY RUN - Would apply this fix:'));
        const diff = this.diffViewer.generateDiff(fix.oldCode, fix.newCode, fix.file);
        this.diffViewer.displayDiff(diff);
        continue;
      }
      
      // Frage nach Bestätigung
      const approved = await this.askForApproval(fix);
      
      if (approved) {
        const spinner = ora('Applying fix...').start();
        try {
          await this.diffViewer.applyChange(fix);
          this.session!.appliedFixes.push({
            file: fix.file,
            success: true
          });
          spinner.succeed(colors.success('Fix applied (backup created)'));
        } catch (error) {
          spinner.fail(colors.error('Failed to apply fix'));
          console.error(status.error(`Failed to apply fix to ${fix.file}:`), error);
          this.session!.appliedFixes.push({
            file: fix.file,
            success: false,
            error: String(error)
          });
        }
      } else {
        console.log(status.info(`Skipped fix for ${fix.file}`));
      }
    }
  }

  /**
   * Fragt nach Benutzerfreigabe für einen Fix
   */
  private async askForApproval(fix: CodeChange): Promise<boolean> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      console.log(`\n💡 Reason: ${fix.reason}`);
      
      // Zeige Diff
      const diff = this.diffViewer.generateDiff(fix.oldCode, fix.newCode, fix.file);
      this.diffViewer.displayDiff(diff);
      
      const askQuestion = () => {
        rl.question('👉 Apply this fix? [y/n/q/d]: ', (answer) => {
          const choice = answer.trim().toLowerCase();
          
          switch (choice) {
            case 'y':
            case 'yes':
              rl.close();
              resolve(true);
              break;
            case 'n':
            case 'no':
              rl.close();
              resolve(false);
              break;
            case 'q':
            case 'quit':
              rl.close();
              process.exit(0);
              break;
            case 'd':
            case 'diff':
              // Zeige vollständigen Diff
              console.log('\n📄 Full diff:');
              console.log(diff);
              askQuestion();
              break;
            default:
              console.log('❌ Invalid choice. Please enter y/n/q/d');
              askQuestion();
          }
        });
      };
      
      askQuestion();
    });
  }

  /**
   * Führt Tests erneut aus
   */
  private async rerunTests(): Promise<void> {
    console.log(header.sub('🔄 RE-RUNNING TESTS'));
    const spinner = ora('Re-running tests...').start();
    
    try {
      const { stdout } = await execAsync('npx playwright test');
      spinner.succeed(colors.success('All tests passed!'));
      this.session!.iterations++;
    } catch (error: any) {
      spinner.fail(colors.error('Some tests still failing'));
      this.session!.iterations++;
      
      if (this.session!.iterations < this.session!.maxIterations) {
        console.log(colors.info(`Starting iteration ${this.session!.iterations + 1}/${this.session!.maxIterations}`));
        // Hier könnte man eine Rekursion einbauen für weitere Iterationen
      } else {
        console.log(status.warning('Maximum iterations reached'));
      }
    }
  }

  /**
   * Extrahiert Learnings aus der Session
   */
  private async extractLearnings(): Promise<void> {
    console.log(header.sub('🧠 EXTRACTING LEARNINGS'));
    const spinner = ora('Extracting learnings...').start();
    
    if (!this.session) {
      spinner.fail(colors.error('No session data'));
      return;
    }
    
    try {
      // Erstelle Learnings-Verzeichnis
      const learningsDir = path.join(process.cwd(), '.test-healing', 'sessions');
      await fs.mkdir(learningsDir, { recursive: true });
      
      // Speichere Session-Daten
      const sessionFile = path.join(learningsDir, `${this.session.sessionId}.json`);
      await fs.writeFile(sessionFile, JSON.stringify(this.session, null, 2));
      
      spinner.succeed(colors.success('Learnings extracted'));
      console.log(colors.dim(`Session data saved: ${sessionFile}`));
      
      // Analysiere Patterns
      const patterns = this.analyzePatterns();
      if (patterns.length > 0) {
        console.log('\n' + colors.info('Detected patterns:'));
        patterns.forEach(pattern => {
          console.log(colors.dim(`  • ${pattern}`));
        });
      }
    } catch (error) {
      spinner.fail(colors.error('Failed to extract learnings'));
      console.error(error);
    }
  }

  /**
   * Analysiert Patterns in den Fixes
   */
  private analyzePatterns(): string[] {
    if (!this.session) return [];
    
    const patterns: string[] = [];
    const fileCounts = new Map<string, number>();
    
    // Zähle Datei-Modifikationen
    this.session.appliedFixes.forEach(fix => {
      const count = fileCounts.get(fix.file) || 0;
      fileCounts.set(fix.file, count + 1);
    });
    
    // Finde wiederkehrende Patterns
    fileCounts.forEach((count, file) => {
      if (count > 1) {
        patterns.push(`File ${file} modified ${count} times - consider refactoring`);
      }
    });
    
    return patterns;
  }

  /**
   * Zeigt Zusammenfassung der Session
   */
  private showSummary(): void {
    if (!this.session) return;
    
    console.log(header.main('📊 SESSION SUMMARY'));
    
    console.log(colors.emoji('🆔', `Session ID: ${this.session.sessionId}`));
    console.log(colors.emoji('⏰', `Timestamp: ${this.session.timestamp.toISOString()}`));
    console.log(colors.emoji('🔄', `Iterations: ${this.session.iterations}/${this.session.maxIterations}`));
    console.log(colors.emoji('🎯', `Strategy: ${this.session.selectedStrategy?.name || 'None'}`));
    console.log(colors.emoji('📁', `Files modified: ${this.session.appliedFixes.length}`));
    
    const successfulFixes = this.session.appliedFixes.filter(f => f.success).length;
    const successRate = this.session.appliedFixes.length > 0 
      ? (successfulFixes / this.session.appliedFixes.length * 100).toFixed(1)
      : '0';
    
    const rateColor = parseFloat(successRate) === 100 ? colors.success : colors.warning;
    console.log(colors.emoji('📈', `Success rate: ${rateColor(successRate + '%')}`));
    
    if (successfulFixes === this.session.appliedFixes.length && this.session.appliedFixes.length > 0) {
      console.log('\n' + colors.success('🎉 All fixes applied successfully! Great work!'));
    } else if (this.session.appliedFixes.length > 0) {
      console.log('\n' + colors.warning('⚠️  Some fixes failed. Consider manual review.'));
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  // Check for smart healing modes
  if (args.includes('--smart') || args.includes('--auto') || args.includes('--force')) {
    // Import and run smart healing
    const { SmartHealer } = await import('./smart-heal');
    
    const mode = args.includes('--auto') ? 'auto' : 
                args.includes('--force') ? 'force' : 'dry-run';
    const trigger = args.includes('--ci') ? 'ci' : 'manual';
    const verbose = args.includes('--verbose');
    
    const smartHealer = new SmartHealer({ mode, trigger, verbose });
    await smartHealer.smartHeal();
    return;
  }
  
  // Parse options for interactive healing
  const options: HealingOptions = {
    verbose: args.includes('--verbose'),
    dryRun: args.includes('--dry-run'),
    maxIterations: 3
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🧪 Interactive Test Healing System

Usage:
  npm run test:interactive                    # Interactive mode (default)
  npm run test:interactive -- --smart         # Smart auto-healing mode
  npm run test:interactive -- --auto          # Auto-heal safe patterns
  npm run test:interactive -- --force         # Force auto-healing
  npm run test:interactive -- --dry-run       # Show what would be done
  npm run test:interactive -- --verbose       # Show detailed output

Smart Healing Modes:
  --smart        Use smart pattern detection (default: dry-run)
  --auto         Auto-heal safe patterns only
  --force        Force auto-healing (dangerous!)

Options:
  --verbose     Show detailed output
  --dry-run     Show what would be done without applying changes
  --ci          Running in CI environment
  --help, -h    Show this help message

Environment Variables:
  ANTHROPIC_API_KEY - Required for Claude API access
`);
    process.exit(0);
  }
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be applied\n');
  }
  
  const healer = new InteractiveHealer(options);
  await healer.startHealing();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { InteractiveHealer };
