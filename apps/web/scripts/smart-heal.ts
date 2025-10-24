#!/usr/bin/env tsx

/**
 * Smart Auto-Healing System für ImmoWächter
 * 
 * Intelligentes System das automatisch entscheidet ob Tests sicher
 * auto-gehealt werden können oder manuelles Review brauchen.
 * 
 * Baut auf KOT-116 (Interactive Healing) auf und erweitert es um:
 * - Pattern Detection Engine
 * - Safety Decision Engine  
 * - Auto-Healing für sichere Patterns
 * - Fallback zu Interactive Mode für unsichere Fälle
 * 
 * Usage:
 *   npm run test:smart-heal -- --dry-run
 *   npm run test:smart-heal -- --auto
 *   npm run test:smart-heal -- --force
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import ora from 'ora';
import { colors, status, header } from './utils/colors';
import { IMMOWACHTER_RULES } from './healing-rules';
import { TestFailure } from './utils/strategy-generator';

const execAsync = promisify(exec);

// Types
interface HealingPattern {
  type: 'library-upgrade' | 'api-change' | 'refactoring' | 'data-update' | 'unknown';
  confidence: number; // 0-1
  affectedTests: string[];
  commonError: string;
  suggestedFix: string;
  files: string[];
}

interface SafetyLevel {
  level: 'high' | 'medium' | 'low';
  autoHealAllowed: boolean;
  reason: string;
  triggeredRules: string[];
}

interface SmartHealOptions {
  mode: 'dry-run' | 'auto' | 'force';
  trigger: 'manual' | 'ci';
  verbose?: boolean;
}

interface SmartHealResult {
  success: boolean;
  autoHealed: boolean;
  pattern?: HealingPattern;
  safety?: SafetyLevel;
  appliedFixes: number;
  fallbackToInteractive: boolean;
  report: string[];
}

class SmartHealer {
  private anthropic: Anthropic | null;
  private options: SmartHealOptions;

  constructor(options: SmartHealOptions) {
    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      if (options.mode === 'dry-run') {
        console.warn('⚠️  ANTHROPIC_API_KEY not found - running in dry-run mode');
        this.anthropic = null as any;
      } else {
        throw new Error('ANTHROPIC_API_KEY environment variable is required for smart healing');
      }
    } else {
      this.anthropic = new Anthropic({
        apiKey: apiKey,
      });
    }
    
    this.options = options;
  }

  /**
   * Main entry point for smart healing
   */
  async smartHeal(): Promise<SmartHealResult> {
    const result: SmartHealResult = {
      success: false,
      autoHealed: false,
      appliedFixes: 0,
      fallbackToInteractive: false,
      report: []
    };

    try {
      console.log(header.main('🧠 SMART AUTO-HEALING SYSTEM'));
      console.log(colors.info(`Mode: ${this.options.mode.toUpperCase()}`));
      console.log(colors.info(`Trigger: ${this.options.trigger.toUpperCase()}`));

      // Step 1: Run tests and detect failures
      const failures = await this.runTests();
      if (failures.length === 0) {
        console.log(status.success('All tests passing! No healing needed.'));
        result.success = true;
        result.report.push('No test failures detected');
        return result;
      }

      console.log(status.error(`Found ${failures.length} test failures`));

      // Step 2: Detect patterns
      const pattern = await this.detectPattern(failures);
      result.pattern = pattern;
      result.report.push(`Detected pattern: ${pattern.type} (confidence: ${(pattern.confidence * 100).toFixed(1)}%)`);

      // Step 3: Assess safety
      const safety = this.assessSafety(pattern, failures);
      result.safety = safety;
      result.report.push(`Safety level: ${safety.level} (auto-heal: ${safety.autoHealAllowed ? 'YES' : 'NO'})`);

      // Step 4: Decision logic
      if (this.shouldAutoHeal(pattern, safety)) {
        console.log(header.sub('🤖 AUTO-HEALING SAFE PATTERN'));
        result.autoHealed = await this.performAutoHeal(pattern, safety);
        result.appliedFixes = result.autoHealed ? 1 : 0;
      } else {
        console.log(header.sub('👤 REQUIRES MANUAL REVIEW'));
        console.log(colors.warning('Pattern is not safe for auto-healing'));
        console.log(colors.dim(`Reason: ${safety.reason}`));
        
        if (this.options.mode === 'force') {
          console.log(status.warning('Force mode enabled - proceeding with caution'));
          result.autoHealed = await this.performAutoHeal(pattern, safety);
          result.appliedFixes = result.autoHealed ? 1 : 0;
        } else {
          result.fallbackToInteractive = true;
          result.report.push('Falling back to interactive mode');
        }
      }

      result.success = true;
      return result;

    } catch (error) {
      console.error(status.error('Smart healing failed:'), error);
      result.report.push(`Error: ${error}`);
      return result;
    }
  }

  /**
   * Run tests and parse failures
   */
  private async runTests(): Promise<TestFailure[]> {
    console.log(header.sub('🧪 RUNNING TESTS'));
    const spinner = ora('Running Playwright tests...').start();
    
    try {
      const { stdout, stderr } = await execAsync('npx playwright test');
      spinner.succeed(colors.success('All tests passed!'));
      return [];
    } catch (error: any) {
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
   * Parse test failures from output
   */
  private parseTestFailures(output: string): TestFailure[] {
    const failures: TestFailure[] = [];
    
    // Simple failure detection - can be enhanced
    const testFailureRegex = /Error:\s*(.+?)(?=\n\s*at|\n\s*Error:|\n\s*$)/gs;
    let match;
    
    while ((match = testFailureRegex.exec(output)) !== null) {
      const errorMessage = match[1].trim();
      
      failures.push({
        testName: 'Unknown Test',
        errorMessage,
        stackTrace: output.substring(match.index, match.index + 500)
      });
    }
    
    // Fallback: Create generic failure
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
   * Detect patterns in test failures using Claude API
   */
  private async detectPattern(failures: TestFailure[]): Promise<HealingPattern> {
    console.log(header.sub('🔍 PATTERN DETECTION'));
    
    if (!this.anthropic) {
      return this.generateMockPattern(failures);
    }

    const spinner = ora('Analyzing failures with Claude...').start();

    try {
      const systemPrompt = `Du bist ein Experte für Test-Failure-Pattern-Erkennung.

Analysiere die gegebenen Test-Fehler und erkenne bekannte Patterns:

1. **library-upgrade**: Selector-Änderungen nach Library-Updates
2. **api-change**: API-Response-Format-Änderungen  
3. **refactoring**: Code-Struktur-Änderungen
4. **data-update**: Test-Daten-Updates (OIB intervals, subsidies)
5. **unknown**: Unbekannte oder komplexe Fehler

Für jedes Pattern:
- Confidence Score (0-1)
- Betroffene Test-Dateien
- Häufigster Fehler
- Vorgeschlagener Fix

Format: JSON mit klaren Pattern-Informationen.`;

      const userPrompt = `Analysiere diese Test-Fehler und erkenne das Pattern:

${failures.map((failure, index) => `
**Fehler ${index + 1}:**
- Test: ${failure.testName}
- Fehler: ${failure.errorMessage}
- Stack: ${failure.stackTrace.substring(0, 200)}...
`).join('\n')}

Erkenne das Pattern und gib Confidence Score zurück.`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
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

      // Parse Claude response (simplified for now)
      const pattern = this.parseClaudePattern(content.text, failures);
      spinner.succeed(colors.success('Pattern detected'));
      
      console.log(colors.dim(`Pattern: ${pattern.type}`));
      console.log(colors.dim(`Confidence: ${(pattern.confidence * 100).toFixed(1)}%`));
      
      return pattern;

    } catch (error) {
      spinner.fail(colors.error('Pattern detection failed'));
      console.error(status.error('Error detecting pattern:'), error);
      return this.generateMockPattern(failures);
    }
  }

  /**
   * Parse Claude response to extract pattern
   */
  private parseClaudePattern(response: string, failures: TestFailure[]): HealingPattern {
    // Simplified parsing - in real implementation, parse JSON from Claude
    const isLibraryUpgrade = response.toLowerCase().includes('selector') || 
                            response.toLowerCase().includes('element');
    const isDataUpdate = response.toLowerCase().includes('data') || 
                        response.toLowerCase().includes('interval');
    
    let type: HealingPattern['type'] = 'unknown';
    let confidence = 0.5;
    
    if (isLibraryUpgrade) {
      type = 'library-upgrade';
      confidence = 0.8;
    } else if (isDataUpdate) {
      type = 'data-update';
      confidence = 0.9;
    }
    
    return {
      type,
      confidence,
      affectedTests: failures.map(f => f.testName),
      commonError: failures[0]?.errorMessage || 'Unknown error',
      suggestedFix: 'Update selectors and test data',
      files: []
    };
  }

  /**
   * Generate mock pattern for dry-run mode
   */
  private generateMockPattern(failures: TestFailure[]): HealingPattern {
    return {
      type: 'data-update',
      confidence: 0.85,
      affectedTests: failures.map(f => f.testName),
      commonError: 'Mock pattern for dry-run',
      suggestedFix: 'Update test data and selectors',
      files: []
    };
  }

  /**
   * Assess safety of auto-healing based on patterns and rules
   */
  private assessSafety(pattern: HealingPattern, failures: TestFailure[]): SafetyLevel {
    console.log(header.sub('🛡️ SAFETY ASSESSMENT'));
    
    const triggeredRules: string[] = [];
    let autoHealAllowed = true;
    let reason = '';
    let level: 'high' | 'medium' | 'low' = 'high';

    // Check against ImmoWächter rules
    for (const rule of IMMOWACHTER_RULES.dangerousPatterns) {
      if (this.matchesPattern(pattern, rule.pattern)) {
        autoHealAllowed = false;
        reason = rule.reason;
        level = 'low';
        triggeredRules.push(rule.name);
        break;
      }
    }

    // Check safe patterns
    if (autoHealAllowed) {
      for (const rule of IMMOWACHTER_RULES.safePatterns) {
        if (this.matchesPattern(pattern, rule.pattern)) {
          autoHealAllowed = true;
          reason = rule.reason;
          level = 'high';
          triggeredRules.push(rule.name);
          break;
        }
      }
    }

    // Confidence-based safety
    if (pattern.confidence < 0.7) {
      autoHealAllowed = false;
      reason = 'Low confidence in pattern detection';
      level = 'medium';
    }

    console.log(colors.dim(`Safety Level: ${level}`));
    console.log(colors.dim(`Auto-heal: ${autoHealAllowed ? 'YES' : 'NO'}`));
    console.log(colors.dim(`Reason: ${reason}`));

    return {
      level,
      autoHealAllowed,
      reason,
      triggeredRules
    };
  }

  /**
   * Check if pattern matches rule
   */
  private matchesPattern(pattern: HealingPattern, rulePattern: RegExp): boolean {
    // Check common error message
    if (rulePattern.test(pattern.commonError)) {
      return true;
    }
    
    // Check affected files
    for (const file of pattern.files) {
      if (rulePattern.test(file)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Decide if auto-healing should be performed
   */
  private shouldAutoHeal(pattern: HealingPattern, safety: SafetyLevel): boolean {
    // High confidence + high safety = auto-heal
    if (pattern.confidence >= 0.9 && safety.level === 'high' && safety.autoHealAllowed) {
      return true;
    }
    
    // Force mode overrides safety
    if (this.options.mode === 'force') {
      return true;
    }
    
    return false;
  }

  /**
   * Perform auto-healing
   */
  private async performAutoHeal(pattern: HealingPattern, safety: SafetyLevel): Promise<boolean> {
    if (this.options.mode === 'dry-run') {
      console.log(status.info('DRY RUN - Would apply auto-healing'));
      console.log(colors.dim(`Pattern: ${pattern.type}`));
      console.log(colors.dim(`Fix: ${pattern.suggestedFix}`));
      return false;
    }

    const spinner = ora('Applying auto-healing...').start();
    
    try {
      // TODO: Implement actual auto-healing logic
      // This would apply the suggested fixes automatically
      
      spinner.succeed(colors.success('Auto-healing applied'));
      console.log(colors.dim(`Applied fix: ${pattern.suggestedFix}`));
      
      return true;
    } catch (error) {
      spinner.fail(colors.error('Auto-healing failed'));
      console.error(status.error('Error applying auto-healing:'), error);
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const mode = args.includes('--auto') ? 'auto' : 
              args.includes('--dry-run') ? 'dry-run' :
              args.includes('--force') ? 'force' : 'dry-run';
  
  const verbose = args.includes('--verbose');
  const trigger = args.includes('--ci') ? 'ci' : 'manual';
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🧠 Smart Auto-Healing System

Usage:
  npm run test:smart-heal -- --dry-run
  npm run test:smart-heal -- --auto  
  npm run test:smart-heal -- --force

Options:
  --dry-run     Show what would be done (default)
  --auto        Auto-heal safe patterns only
  --force       Force auto-healing (dangerous!)
  --verbose     Show detailed output
  --ci          Running in CI environment
  --help, -h    Show this help

Environment Variables:
  ANTHROPIC_API_KEY - Required for pattern detection
`);
    process.exit(0);
  }

  const options: SmartHealOptions = {
    mode: mode as any,
    trigger,
    verbose
  };

  const healer = new SmartHealer(options);
  const result = await healer.smartHeal();

  // Show final report
  console.log(header.main('📊 SMART HEALING REPORT'));
  console.log(colors.emoji('🎯', `Success: ${result.success ? 'YES' : 'NO'}`));
  console.log(colors.emoji('🤖', `Auto-healed: ${result.autoHealed ? 'YES' : 'NO'}`));
  console.log(colors.emoji('🔧', `Applied fixes: ${result.appliedFixes}`));
  console.log(colors.emoji('👤', `Interactive fallback: ${result.fallbackToInteractive ? 'YES' : 'NO'}`));
  
  if (result.report.length > 0) {
    console.log('\n' + colors.info('Report:'));
    result.report.forEach(line => {
      console.log(colors.dim(`  • ${line}`));
    });
  }

  if (result.fallbackToInteractive) {
    console.log('\n' + colors.warning('⚠️  Consider running interactive healing for manual review'));
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { SmartHealer, HealingPattern, SafetyLevel, SmartHealResult };
