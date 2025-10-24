#!/usr/bin/env tsx

/**
 * Create Tasks from Learnings Script
 * 
 * Lädt Learnings aus der letzten Session und erstellt
 * Linear Tasks basierend auf den erkannten Patterns.
 * 
 * Usage:
 *   npm run test:create-tasks
 *   npm run test:create-tasks -- --dry-run
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import ora from 'ora';
import LearningsAnalyzer, { SessionLearning, LinearTaskSuggestion } from './utils/learnings-analyzer';
import { linearAPI, getTeamIdByKey, getOrCreateLabels, createLinearIssue } from '../lib/linear-api';
import { colors, status, header } from './utils/colors';

interface TaskCreationOptions {
  dryRun?: boolean;
  verbose?: boolean;
  sessionId?: string;
}

class TaskCreator {
  private analyzer: LearningsAnalyzer;
  private options: TaskCreationOptions;

  constructor(options: TaskCreationOptions = {}) {
    this.analyzer = new LearningsAnalyzer();
    this.options = {
      dryRun: false,
      verbose: false,
      ...options
    };
  }

  /**
   * Haupt-Einstiegspunkt
   */
  async createTasksFromLearnings(): Promise<void> {
    try {
      console.log(header.main('🧠 LINEAR TASK CREATION'));
      
      // Lade Learnings
      const spinner = ora('Loading learnings...').start();
      const learnings = await this.loadLearnings();
      
      if (learnings.length === 0) {
        spinner.fail(colors.error('No learnings found. Run test healing first.'));
        return;
      }
      
      spinner.succeed(colors.success('Learnings loaded'));
      
      // Zeige verfügbare Sessions
      this.displayAvailableSessions(learnings);
      
      // Wähle Session
      const selectedLearning = await this.selectSession(learnings);
      if (!selectedLearning) {
        console.log(status.info('Task creation cancelled'));
        return;
      }
      
      // Zeige vorgeschlagene Tasks
      this.displaySuggestedTasks(selectedLearning);
      
      if (this.options.dryRun) {
        console.log('\n' + status.info('DRY RUN MODE - No tasks will be created'));
        return;
      }
      
      // Erstelle Tasks
      await this.createTasks(selectedLearning.suggestedTasks);
      
    } catch (error) {
      console.error(status.error('Error creating tasks:'), error);
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
   * Zeigt verfügbare Sessions
   */
  private displayAvailableSessions(learnings: SessionLearning[]): void {
    console.log(header.sub('📊 AVAILABLE LEARNING SESSIONS'));
    
    learnings.forEach((learning, index) => {
      console.log(colors.bold(`${index + 1}. ${learning.sessionId}`));
      console.log(colors.dim(`   Date: ${learning.timestamp.toISOString()}`));
      console.log(colors.dim(`   Suggested Tasks: ${learning.suggestedTasks.length}`));
      console.log('');
    });
  }

  /**
   * Wählt eine Session aus
   */
  private async selectSession(learnings: SessionLearning[]): Promise<SessionLearning | null> {
    if (learnings.length === 1) {
      return learnings[0];
    }
    
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      const askForChoice = () => {
        rl.question(`\n👉 Select session [1-${learnings.length}] or [q]uit: `, (answer) => {
          const choice = answer.trim().toLowerCase();
          
          if (choice === 'q' || choice === 'quit') {
            rl.close();
            resolve(null);
            return;
          }
          
          const index = parseInt(choice) - 1;
          if (index >= 0 && index < learnings.length) {
            rl.close();
            resolve(learnings[index]);
          } else {
            console.log('❌ Invalid choice. Please try again.');
            askForChoice();
          }
        });
      };
      
      askForChoice();
    });
  }

  /**
   * Zeigt vorgeschlagene Tasks
   */
  private displaySuggestedTasks(learning: SessionLearning): void {
    console.log(header.sub(`💡 SUGGESTED TASKS FOR SESSION: ${learning.sessionId}`));
    
    learning.suggestedTasks.forEach((task, index) => {
      const priorityIcon = this.getPriorityIcon(task.priority);
      const priorityText = this.getPriorityText(task.priority);
      const priorityColor = this.getPriorityColor(task.priority);
      
      console.log('\n' + colors.bold(`${index + 1}. ${task.title}`));
      console.log(colors.dim(`   ${priorityIcon} Priority: ${priorityColor(priorityText)}`));
      console.log(colors.dim(`   🏷️  Labels: ${task.labels.join(', ')}`));
      console.log(colors.dim(`   ⏱️  Time: ${task.estimatedTime}`));
      console.log(colors.dim(`   💭 Reasoning: ${task.reasoning}`));
      
      if (this.options.verbose) {
        console.log(colors.dim(`   📝 Description: ${task.description.substring(0, 200)}...`));
      }
    });
  }

  /**
   * Erstellt Tasks in Linear
   */
  private async createTasks(tasks: LinearTaskSuggestion[]): Promise<void> {
    console.log(header.sub('🚀 CREATING LINEAR TASKS'));
    
    const createdTasks: Array<{ title: string; url?: string; error?: string }> = [];
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      console.log('\n' + colors.bold(`Task ${i + 1}/${tasks.length}:`));
      console.log(colors.dim(`Reasoning: ${task.reasoning}`));
      
      // Frage nach Bestätigung
      const approved = await this.askForTaskApproval(task);
      
      if (approved) {
        try {
          // Erstelle echte Linear Task
          const taskUrl = await this.createLinearTask(task);
          
          createdTasks.push({
            title: task.title,
            url: taskUrl
          });
          
          console.log(colors.success(`Created: ${taskUrl}`));
        } catch (error) {
          console.error(status.error(`Failed to create task: ${error}`));
          createdTasks.push({
            title: task.title,
            error: String(error)
          });
        }
      } else {
        console.log(status.info(`Skipped task: ${task.title}`));
      }
    }
    
    // Zeige Zusammenfassung
    this.showCreationSummary(createdTasks);
  }

  /**
   * Fragt nach Task-Bestätigung
   */
  private async askForTaskApproval(task: LinearTaskSuggestion): Promise<boolean> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      const askQuestion = () => {
        rl.question(`\n👉 Create this task? [y/n/e/q]: `, (answer) => {
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
            case 'e':
            case 'edit':
              // TODO: Implement task editing
              console.log('📝 Task editing not implemented yet');
              askQuestion();
              break;
            case 'q':
            case 'quit':
              rl.close();
              process.exit(0);
              break;
            default:
              console.log('❌ Invalid choice. Please enter y/n/e/q');
              askQuestion();
          }
        });
      };
      
      askQuestion();
    });
  }

  /**
   * Erstellt echte Linear Task
   */
  private async createLinearTask(task: LinearTaskSuggestion): Promise<string> {
    try {
      console.log(header.sub(`🚀 CREATING LINEAR TASK`));
      console.log(colors.bold(task.title));
      console.log(colors.dim(`   📊 Priority: ${this.getPriorityText(task.priority)}`));
      console.log(colors.dim(`   🏷️  Labels: ${task.labels.join(', ')}`));
      console.log(colors.dim(`   ⏱️  Estimated: ${task.estimatedTime}`));
      
      // Prüfe API Key
      if (!process.env.LINEAR_API_TOKEN) {
        throw new Error('LINEAR_API_TOKEN environment variable is required');
      }
      
      // Finde Team
      let spinner = ora('Getting team Kotto...').start();
      const teamId = await getTeamIdByKey('KOT');
      spinner.succeed(colors.success('Team found!'));
      
      // Verwalte Labels
      spinner = ora('Processing labels...').start();
      const labelIds = await getOrCreateLabels(teamId, task.labels);
      spinner.succeed(colors.success(`Labels ready (${labelIds.length} total)`));
      
      // Erstelle Issue
      spinner = ora('Creating issue in Linear...').start();
      const result = await createLinearIssue({
        title: task.title,
        description: task.description,
        teamId: teamId,
        priority: task.priority,
        labelIds: labelIds
      });
      
      if (!result.success || !result.issue) {
        throw new Error('Failed to create Linear issue');
      }
      
      const taskUrl = result.issue.url || `https://linear.app/kotto/issue/${result.issue.identifier}`;
      const taskId = result.issue.identifier;
      
      spinner.succeed(colors.success('Task created!'));
      
      console.log(colors.emoji('🔗', colors.link(taskUrl)));
      console.log(colors.emoji('🆔', taskId));
      
      // Speichere Task-Info
      await this.saveTaskInfo(task, taskId, taskUrl);
      
      return taskUrl;
      
    } catch (error) {
      console.error(status.error('Failed to create Linear task:'), error);
      throw error;
    }
  }

  /**
   * Speichert Task-Informationen
   */
  private async saveTaskInfo(task: LinearTaskSuggestion, taskId: string, taskUrl: string): Promise<void> {
    const tasksFile = path.join(process.cwd(), '.test-healing', 'tasks-created.json');
    
    let existingTasks = [];
    try {
      const content = await fs.readFile(tasksFile, 'utf-8');
      existingTasks = JSON.parse(content);
    } catch {
      // Datei existiert nicht, erstelle leeres Array
    }
    
    const taskInfo = {
      taskId,
      taskUrl,
      title: task.title,
      description: task.description,
      priority: task.priority,
      labels: task.labels,
      createdAt: new Date().toISOString(),
      reasoning: task.reasoning
    };
    
    existingTasks.push(taskInfo);
    
    await fs.writeFile(tasksFile, JSON.stringify(existingTasks, null, 2));
  }

  /**
   * Zeigt Zusammenfassung der Task-Erstellung
   */
  private showCreationSummary(createdTasks: Array<{ title: string; url?: string; error?: string }>): void {
    console.log(header.main('📊 TASK CREATION SUMMARY'));
    
    const successful = createdTasks.filter(t => t.url).length;
    const failed = createdTasks.filter(t => t.error).length;
    const skipped = createdTasks.filter(t => !t.url && !t.error).length;
    
    console.log(colors.emoji('📊', `Total tasks: ${createdTasks.length}`));
    console.log(colors.emoji('✅', `Created: ${colors.success(successful.toString())}`));
    console.log(colors.emoji('❌', `Failed: ${colors.error(failed.toString())}`));
    console.log(colors.emoji('⏭️', `Skipped: ${colors.warning(skipped.toString())}`));
    
    if (successful > 0) {
      console.log('\n' + colors.success('🎉 Created tasks:'));
      createdTasks.filter(t => t.url).forEach(task => {
        console.log(colors.dim(`  • ${task.title}`));
        console.log(colors.dim(`    ${task.url}`));
      });
    }
    
    if (failed > 0) {
      console.log('\n' + colors.warning('⚠️  Failed tasks:'));
      createdTasks.filter(t => t.error).forEach(task => {
        console.log(colors.dim(`  • ${task.title}: ${task.error}`));
      });
    }
    
    console.log('\n' + colors.success('🎉 Task creation complete!'));
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

  /**
   * Gibt Priority-Farbe zurück
   */
  private getPriorityColor(priority: number): (text: string) => string {
    switch (priority) {
      case 1: return colors.error; // Urgent - Red
      case 2: return colors.warning; // High - Yellow
      case 3: return colors.info; // Medium - Blue
      case 4: return colors.success; // Low - Green
      default: return colors.dim;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options: TaskCreationOptions = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
    sessionId: args.find(arg => arg.startsWith('--session='))?.split('=')[1]
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📋 Create Linear Tasks from Learnings

Usage:
  npm run test:create-tasks
  npm run test:create-tasks -- --dry-run
  npm run test:create-tasks -- --session=session_123

Options:
  --dry-run           Show what would be created without making changes
  --verbose           Show detailed output
  --session=ID        Create tasks for specific session
  --help, -h          Show this help message

Environment Variables:
  LINEAR_API_KEY      Required for Linear API access (not implemented yet)
`);
    process.exit(0);
  }
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No tasks will be created\n');
  }
  
  const creator = new TaskCreator(options);
  await creator.createTasksFromLearnings();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { TaskCreator };
