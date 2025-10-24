#!/usr/bin/env tsx

/**
 * Rollback Script für Test Healing System
 * 
 * Stellt alle Dateien aus Backup-Dateien wieder her
 * und löscht die Backup-Dateien.
 * 
 * Usage:
 *   npm run test:rollback
 *   npm run test:rollback -- --dry-run
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import DiffViewer from './utils/diff-viewer';

interface RollbackOptions {
  dryRun?: boolean;
  verbose?: boolean;
}

class RollbackManager {
  private diffViewer: DiffViewer;
  private options: RollbackOptions;

  constructor(options: RollbackOptions = {}) {
    this.diffViewer = new DiffViewer({ colorize: true });
    this.options = {
      dryRun: false,
      verbose: false,
      ...options
    };
  }

  /**
   * Haupt-Einstiegspunkt
   */
  async rollbackAll(): Promise<void> {
    try {
      console.log('🔄 Starting rollback process...\n');
      
      // Finde alle Backup-Dateien
      const backups = await this.findBackups();
      
      if (backups.length === 0) {
        console.log('✅ No backup files found. Nothing to rollback.');
        return;
      }
      
      console.log(`📁 Found ${backups.length} backup files:`);
      backups.forEach(backup => {
        console.log(`  • ${backup}`);
      });
      
      if (this.options.dryRun) {
        console.log('\n🔍 DRY RUN MODE - No changes will be made');
        return;
      }
      
      // Bestätigung vom Benutzer
      const confirmed = await this.askForConfirmation(backups.length);
      if (!confirmed) {
        console.log('👋 Rollback cancelled by user');
        return;
      }
      
      // Stelle Dateien wieder her
      let successCount = 0;
      let errorCount = 0;
      
      for (const backup of backups) {
        try {
          await this.restoreFile(backup);
          successCount++;
          
          if (this.options.verbose) {
            console.log(`✅ Restored: ${backup}`);
          }
        } catch (error) {
          console.error(`❌ Failed to restore ${backup}:`, error);
          errorCount++;
        }
      }
      
      // Zeige Zusammenfassung
      this.showSummary(successCount, errorCount, backups.length);
      
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      process.exit(1);
    }
  }

  /**
   * Findet alle Backup-Dateien
   */
  private async findBackups(): Promise<string[]> {
    return await this.diffViewer.findBackups(process.cwd());
  }

  /**
   * Fragt nach Benutzerbestätigung
   */
  private async askForConfirmation(backupCount: number): Promise<boolean> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question(`\n⚠️  This will restore ${backupCount} files from backups. Continue? [y/N]: `, (answer) => {
        rl.close();
        const choice = answer.trim().toLowerCase();
        resolve(choice === 'y' || choice === 'yes');
      });
    });
  }

  /**
   * Stellt eine einzelne Datei wieder her
   */
  private async restoreFile(backupPath: string): Promise<void> {
    // Bestimme den ursprünglichen Dateinamen
    const originalPath = backupPath.replace('.backup', '');
    
    // Prüfe ob die ursprüngliche Datei existiert
    try {
      await fs.access(originalPath);
    } catch {
      throw new Error(`Original file not found: ${originalPath}`);
    }
    
    // Kopiere Backup über die ursprüngliche Datei
    await fs.copyFile(backupPath, originalPath);
    
    // Lösche die Backup-Datei
    await fs.unlink(backupPath);
  }

  /**
   * Zeigt Zusammenfassung der Rollback-Operation
   */
  private showSummary(successCount: number, errorCount: number, totalCount: number): void {
    console.log('\n📊 ROLLBACK SUMMARY');
    console.log('='.repeat(40));
    console.log(`Total files: ${totalCount}`);
    console.log(`✅ Restored: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 All files restored successfully!');
    } else {
      console.log(`\n⚠️  ${errorCount} files could not be restored. Check the errors above.`);
    }
    
    console.log('='.repeat(40));
  }

  /**
   * Zeigt Status der Backup-Dateien
   */
  async showStatus(): Promise<void> {
    console.log('📊 Backup Status\n');
    
    const backups = await this.findBackups();
    
    if (backups.length === 0) {
      console.log('✅ No backup files found');
      return;
    }
    
    console.log(`📁 Found ${backups.length} backup files:\n`);
    
    for (const backup of backups) {
      const originalPath = backup.replace('.backup', '');
      
      try {
        const backupStats = await fs.stat(backup);
        const originalStats = await fs.stat(originalPath);
        
        console.log(`📄 ${originalPath}`);
        console.log(`   Backup: ${backupStats.mtime.toISOString()}`);
        console.log(`   Current: ${originalStats.mtime.toISOString()}`);
        console.log(`   Size: ${backupStats.size} bytes\n`);
        
      } catch (error) {
        console.log(`📄 ${originalPath}`);
        console.log(`   ⚠️  Error reading file stats: ${error}\n`);
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options: RollbackOptions = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose')
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔄 Test Healing Rollback Script

Usage:
  npm run test:rollback
  npm run test:rollback -- --dry-run
  npm run test:rollback -- --status

Options:
  --dry-run     Show what would be done without making changes
  --verbose     Show detailed output
  --status      Show status of backup files
  --help, -h    Show this help message
`);
    process.exit(0);
  }
  
  if (args.includes('--status')) {
    const manager = new RollbackManager(options);
    await manager.showStatus();
    return;
  }
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }
  
  const manager = new RollbackManager(options);
  await manager.rollbackAll();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { RollbackManager };
