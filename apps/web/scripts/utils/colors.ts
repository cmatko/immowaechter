import chalk from 'chalk';

/**
 * Color utilities for consistent terminal output
 */
export const colors = {
  // Status colors
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  
  // Emphasis
  bold: chalk.bold,
  dim: chalk.dim,
  
  // Special
  link: chalk.cyan.underline,
  emoji: (emoji: string, text: string) => `${emoji} ${text}`,
  
  // Risk levels
  lowRisk: chalk.green,
  mediumRisk: chalk.yellow,
  highRisk: chalk.red,
};

/**
 * Status indicators with emojis
 */
export const status = {
  success: (text: string) => colors.success(`✅ ${text}`),
  error: (text: string) => colors.error(`❌ ${text}`),
  warning: (text: string) => colors.warning(`⚠️  ${text}`),
  info: (text: string) => colors.info(`ℹ️  ${text}`),
  loading: (text: string) => `⏳ ${text}`,
  working: (text: string) => `🔧 ${text}`,
};

/**
 * Section headers
 */
export const header = {
  main: (text: string) => chalk.bold.blue(`\n${'='.repeat(60)}\n${text}\n${'='.repeat(60)}\n`),
  sub: (text: string) => chalk.bold.cyan(`\n${text}\n${'-'.repeat(40)}\n`),
  step: (num: number, text: string) => chalk.bold.white(`\n${num}. ${text}`),
};

/**
 * Boxes for important info
 */
export function box(title: string, content: string[]): string {
  const width = 60;
  const lines = [
    '╔' + '═'.repeat(width - 2) + '╗',
    '║ ' + chalk.bold(title.padEnd(width - 4)) + ' ║',
    '╠' + '═'.repeat(width - 2) + '╣',
    ...content.map(line => '║ ' + line.padEnd(width - 4) + ' ║'),
    '╚' + '═'.repeat(width - 2) + '╝',
  ];
  return chalk.blue(lines.join('\n'));
}
