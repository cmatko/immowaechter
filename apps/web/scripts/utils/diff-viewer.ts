/**
 * Diff Viewer Utilities für Test Healing System
 * 
 * Bietet Funktionen zur Anzeige von Code-Diffs in der Konsole
 * mit farbiger Ausgabe und verschiedenen Ansichtsmodi.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

export interface DiffOptions {
  contextLines?: number;
  showLineNumbers?: boolean;
  colorize?: boolean;
}

export interface CodeChange {
  file: string;
  oldCode: string;
  newCode: string;
  lineNumber?: number;
  reason: string;
}

export class DiffViewer {
  private colorize: boolean;

  constructor(options: DiffOptions = {}) {
    this.colorize = options.colorize ?? true;
  }

  /**
   * Generiert einen Diff zwischen altem und neuem Code
   */
  generateDiff(oldCode: string, newCode: string, filename: string, options: DiffOptions = {}): string {
    const contextLines = options.contextLines ?? 3;
    const showLineNumbers = options.showLineNumbers ?? true;
    
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    
    let diff = '';
    diff += chalk.bold.cyan(`\n📄 ${filename}\n`);
    diff += chalk.dim('─'.repeat(60)) + '\n';
    
    // Simple line-by-line comparison
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine !== newLine) {
        if (oldLine && newLine) {
          // Modified line
          diff += chalk.red(`- ${oldLine}\n`);
          diff += chalk.green(`+ ${newLine}\n`);
        } else if (oldLine) {
          // Deleted line
          diff += chalk.red(`- ${oldLine}\n`);
        } else if (newLine) {
          // Added line
          diff += chalk.green(`+ ${newLine}\n`);
        }
      } else if (oldLine !== undefined) {
        // Unchanged line (show context)
        if (i < contextLines || i >= maxLines - contextLines) {
          diff += chalk.gray(`  ${oldLine}\n`);
        }
      }
    }
    
    diff += chalk.dim('─'.repeat(60)) + '\n';
    
    return diff;
  }

  /**
   * Zeigt einen Diff in der Konsole an
   */
  displayDiff(diff: string): void {
    console.log(diff);
  }

  /**
   * Zeigt eine Zusammenfassung der Änderungen
   */
  displayChangeSummary(changes: CodeChange[]): void {
    console.log(chalk.bold.cyan('\n📋 CHANGE SUMMARY'));
    console.log(chalk.dim('─'.repeat(50)));
    
    changes.forEach((change, index) => {
      console.log('\n' + chalk.bold(`${index + 1}. ${chalk.cyan(change.file)}`));
      console.log(chalk.dim(`   Reason: ${change.reason}`));
      
      const oldLines = change.oldCode.split('\n').length;
      const newLines = change.newCode.split('\n').length;
      
      if (oldLines > newLines) {
        console.log(chalk.dim(`   ${chalk.red(`-${oldLines - newLines} lines`)}`));
      } else if (newLines > oldLines) {
        console.log(chalk.dim(`   ${chalk.green(`+${newLines - oldLines} lines`)}`));
      } else {
        console.log(chalk.dim(`   ${chalk.yellow('~0 lines changed')}`));
      }
    });
    
    console.log(chalk.dim('─'.repeat(50)));
  }

  /**
   * Zeigt eine Vorschau der Änderungen vor der Anwendung
   */
  async previewChanges(changes: CodeChange[]): Promise<void> {
    console.log(chalk.bold.blue('\n🔍 PREVIEWING CHANGES'));
    console.log(chalk.dim('─'.repeat(60)));
    
    for (const change of changes) {
      console.log('\n' + chalk.bold(`📄 File: ${chalk.cyan(change.file)}`));
      console.log(chalk.dim(`💡 Reason: ${change.reason}`));
      
      // Show diff for this change
      const diff = this.generateDiff(change.oldCode, change.newCode, change.file);
      this.displayDiff(diff);
      
      // Ask for confirmation
      console.log(chalk.yellow('Press Enter to continue to next change, or Ctrl+C to cancel...'));
      await this.waitForEnter();
    }
  }

  /**
   * Erstellt eine Backup-Datei
   */
  async createBackup(filePath: string): Promise<string> {
    const backupPath = `${filePath}.backup`;
    await fs.copyFile(filePath, backupPath);
    console.log(chalk.dim(`💾 Backup created: ${backupPath}`));
    return backupPath;
  }

  /**
   * Wendet eine Änderung auf eine Datei an
   */
  async applyChange(change: CodeChange): Promise<void> {
    const filePath = change.file;
    
    // Create backup
    const backupPath = await this.createBackup(filePath);
    
    // Read current content
    const currentContent = await fs.readFile(filePath, 'utf-8');
    
    // Apply change
    const newContent = currentContent.replace(change.oldCode, change.newCode);
    
    // Write new content
    await fs.writeFile(filePath, newContent, 'utf-8');
    
    console.log(chalk.green(`✅ Applied change to ${filePath}`));
  }

  /**
   * Stellt eine Datei aus dem Backup wieder her
   */
  async restoreFromBackup(filePath: string): Promise<void> {
    const backupPath = `${filePath}.backup`;
    
    try {
      await fs.access(backupPath);
      await fs.copyFile(backupPath, filePath);
      await fs.unlink(backupPath);
      console.log(chalk.blue(`🔄 Restored ${filePath} from backup`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  No backup found for ${filePath}`));
    }
  }

  /**
   * Findet alle Backup-Dateien
   */
  async findBackups(directory: string = '.'): Promise<string[]> {
    const backups: string[] = [];
    
    try {
      const files = await fs.readdir(directory, { withFileTypes: true });
      
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.backup')) {
          backups.push(path.join(directory, file.name));
        } else if (file.isDirectory() && !file.name.startsWith('.')) {
          const subBackups = await this.findBackups(path.join(directory, file.name));
          backups.push(...subBackups);
        }
      }
    } catch (error) {
      // Directory might not exist or be accessible
    }
    
    return backups;
  }

  /**
   * Farbige Textausgabe (deprecated - use chalk instead)
   */
  private colorizeText(text: string, color: 'red' | 'green' | 'yellow' | 'cyan' | 'blue' | 'magenta'): string {
    if (!this.colorize) {
      return text;
    }
    
    // Use chalk for better color support
    const chalkColors = {
      red: chalk.red,
      green: chalk.green,
      yellow: chalk.yellow,
      cyan: chalk.cyan,
      blue: chalk.blue,
      magenta: chalk.magenta
    };
    
    return chalkColors[color](text);
  }

  /**
   * Wartet auf Enter-Taste
   */
  private async waitForEnter(): Promise<void> {
    return new Promise((resolve) => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
  }
}

export default DiffViewer;
