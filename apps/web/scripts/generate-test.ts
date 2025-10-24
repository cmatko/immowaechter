#!/usr/bin/env tsx

/**
 * Test Generator Script für ImmoWächter
 * 
 * Generiert automatisch Playwright Tests für Komponenten und Seiten
 * unter Verwendung der Claude API.
 * 
 * Usage:
 *   npm run test:auto-gen -- app/components/PropertyCard.tsx
 *   npm run test:auto-gen -- app/page.tsx
 *   npm run test:auto-gen -- app/api/properties/route.ts
 * 
 * Features:
 * - Analysiert Dateistruktur (Imports, Exports, Props)
 * - Generiert umfassende Playwright Tests
 * - Speichert Tests in tests/auto-generated/
 * - Inkludiert Setup, Happy Paths, Edge Cases, Cleanup
 */

import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import { colors, status, header } from './utils/colors';

// Types
interface FileAnalysis {
  filePath: string;
  fileName: string;
  fileType: 'component' | 'page' | 'api' | 'unknown';
  imports: string[];
  exports: string[];
  props?: string[];
  hooks?: string[];
  functions?: string[];
  content: string;
}

interface GeneratedTest {
  testName: string;
  testContent: string;
  setup: string;
  testCases: string[];
  cleanup: string;
}

class TestGenerator {
  private anthropic: Anthropic;
  private outputDir: string;

  constructor() {
    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  ANTHROPIC_API_KEY not found - running in dry-run mode');
      console.warn('   To generate real tests, set ANTHROPIC_API_KEY environment variable');
      // Create a mock client for dry-run mode
      this.anthropic = null as any;
    } else {
      this.anthropic = new Anthropic({
        apiKey: apiKey,
      });
    }
    
    this.outputDir = path.join(process.cwd(), 'tests', 'auto-generated');
  }

  /**
   * Main entry point
   */
  async generateTest(filePath: string): Promise<void> {
    try {
      console.log(header.main('🧪 TEST GENERATION'));
      console.log(colors.info(`Target: ${filePath}`));
      
      // Analyze the file
      const spinner = ora('Reading file...').start();
      const analysis = await this.analyzeFile(filePath);
      spinner.succeed(colors.success('File read'));
      
      console.log(colors.dim(`📊 Analysis: ${analysis.fileType} file with ${analysis.exports.length} exports`));
      
      // Generate test using Claude
      spinner.start('Analyzing with Claude...');
      const testContent = await this.generateTestWithClaude(analysis);
      spinner.succeed(colors.success('Test generated'));
      
      // Ensure output directory exists
      spinner.start('Saving test file...');
      await this.ensureOutputDirectory();
      
      // Save test file
      const testFileName = this.getTestFileName(analysis.fileName);
      const testFilePath = path.join(this.outputDir, testFileName);
      
      await fs.writeFile(testFilePath, testContent, 'utf-8');
      spinner.succeed(colors.success('Test saved'));
      
      console.log('\n' + colors.success('✅ Test generation complete!'));
      console.log(colors.dim(`Location: ${testFilePath}`));
      console.log(colors.dim('📝 Test includes: Setup, Happy Paths, Edge Cases, Cleanup'));
      
    } catch (error) {
      console.error(status.error('Error generating test:'), error);
      process.exit(1);
    }
  }

  /**
   * Analyze the target file to understand its structure
   */
  private async analyzeFile(filePath: string): Promise<FileAnalysis> {
    const fullPath = path.resolve(filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Determine file type
    const fileType = this.determineFileType(filePath, content);
    
    // Extract imports
    const imports = this.extractImports(content);
    
    // Extract exports
    const exports = this.extractExports(content);
    
    // Extract props (for components)
    const props = fileType === 'component' ? this.extractProps(content) : undefined;
    
    // Extract hooks
    const hooks = this.extractHooks(content);
    
    // Extract functions
    const functions = this.extractFunctions(content);
    
    return {
      filePath: fullPath,
      fileName,
      fileType,
      imports,
      exports,
      props,
      hooks,
      functions,
      content
    };
  }

  /**
   * Determine the type of file based on path and content
   */
  private determineFileType(filePath: string, content: string): FileAnalysis['fileType'] {
    const lowerPath = filePath.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    if (lowerPath.includes('/api/') || lowerPath.includes('route.ts')) {
      return 'api';
    }
    
    if (lowerPath.includes('/components/') || lowerContent.includes('export default function') || lowerContent.includes('export const')) {
      return 'component';
    }
    
    if (lowerPath.includes('page.tsx') || lowerPath.includes('page.ts')) {
      return 'page';
    }
    
    return 'unknown';
  }

  /**
   * Extract import statements
   */
  private extractImports(content: string): string[] {
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  /**
   * Extract export statements
   */
  private extractExports(content: string): string[] {
    const exports: string[] = [];
    
    // Named exports
    const namedExportRegex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    // Default export
    if (content.includes('export default')) {
      exports.push('default');
    }
    
    return exports;
  }

  /**
   * Extract component props
   */
  private extractProps(content: string): string[] {
    const props: string[] = [];
    
    // Interface props
    const interfaceRegex = /interface\s+(\w+Props?)\s*\{([^}]+)\}/g;
    let match;
    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceContent = match[2];
      const propMatches = interfaceContent.match(/(\w+)(?:\?)?\s*:/g);
      if (propMatches) {
        props.push(...propMatches.map(m => m.replace(/[?:]/g, '').trim()));
      }
    }
    
    return props;
  }

  /**
   * Extract React hooks
   */
  private extractHooks(content: string): string[] {
    const hookRegex = /use[A-Z]\w+/g;
    return content.match(hookRegex) || [];
  }

  /**
   * Extract function definitions
   */
  private extractFunctions(content: string): string[] {
    const functions: string[] = [];
    
    // Function declarations
    const funcDeclRegex = /function\s+(\w+)/g;
    let match;
    while ((match = funcDeclRegex.exec(content)) !== null) {
      functions.push(match[1]);
    }
    
    // Arrow functions
    const arrowFuncRegex = /const\s+(\w+)\s*=\s*\(/g;
    while ((match = arrowFuncRegex.exec(content)) !== null) {
      functions.push(match[1]);
    }
    
    return functions;
  }

  /**
   * Generate test content using Claude API
   */
  private async generateTestWithClaude(analysis: FileAnalysis): Promise<string> {
    // Dry-run mode if no API key
    if (!this.anthropic) {
      return this.generateMockTest(analysis);
    }

    const systemPrompt = `Du bist ein Experte für Playwright E2E Tests und Next.js 14 App Router.
    
Generiere einen umfassenden Playwright Test für die gegebene Datei. Der Test sollte:

1. **Setup**: Browser-Konfiguration, Test-Daten, Mock-Setup
2. **Happy Paths**: Hauptfunktionalität testen
3. **Edge Cases**: Fehlerbehandlung, leere Zustände, Grenzfälle
4. **Cleanup**: Aufräumen nach Tests

Verwende moderne Playwright Best Practices:
- page.locator() statt page.$()
- data-testid Attribute bevorzugen
- Warte auf Elemente mit page.waitForSelector()
- Screenshots bei Fehlern
- Proper async/await

Format: TypeScript mit strikter Typisierung.`;

    const userPrompt = `Generiere einen Playwright Test für diese Datei:

**Datei**: ${analysis.filePath}
**Typ**: ${analysis.fileType}
**Exports**: ${analysis.exports.join(', ')}
**Imports**: ${analysis.imports.slice(0, 10).join(', ')}${analysis.imports.length > 10 ? '...' : ''}
${analysis.props ? `**Props**: ${analysis.props.join(', ')}` : ''}
${analysis.hooks.length > 0 ? `**Hooks**: ${analysis.hooks.join(', ')}` : ''}
${analysis.functions.length > 0 ? `**Functions**: ${analysis.functions.join(', ')}` : ''}

**Code-Inhalt**:
\`\`\`typescript
${analysis.content.substring(0, 2000)}${analysis.content.length > 2000 ? '\n// ... (truncated)' : ''}
\`\`\`

Generiere einen vollständigen Playwright Test mit:
- Import statements
- Test suite setup
- Setup/Teardown hooks
- Mehrere Test Cases (happy path + edge cases)
- Proper error handling
- Screenshots bei Fehlern
- TypeScript types

Verwende realistische Test-Daten für ImmoWächter (Immobilienverwaltung).`;

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

      const testContent = response.content[0];
      if (testContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Add header comment
      const header = `/**
 * Auto-generated Playwright Test
 * Generated: ${new Date().toISOString()}
 * Source: ${analysis.filePath}
 * 
 * This test was automatically generated by the test-healing system.
 * Review and customize as needed.
 */

`;

      return header + testContent.text;
      
    } catch (error) {
      console.error(status.error('Error calling Claude API:'), error);
      throw new Error(`Failed to generate test: ${error}`);
    }
  }

  /**
   * Generate mock test for dry-run mode
   */
  private generateMockTest(analysis: FileAnalysis): string {
    const header = `/**
 * Auto-generated Playwright Test (DRY RUN)
 * Generated: ${new Date().toISOString()}
 * Source: ${analysis.filePath}
 * 
 * This is a mock test generated in dry-run mode.
 * Set ANTHROPIC_API_KEY to generate real tests.
 */

import { test, expect } from '@playwright/test';

test.describe('${analysis.fileName}', () => {
  test('should load successfully', async ({ page }) => {
    // Mock test - replace with real implementation
    expect(true).toBe(true);
  });
  
  test('should handle errors gracefully', async ({ page }) => {
    // Mock test - replace with real implementation
    expect(true).toBe(true);
  });
});
`;

    return header;
  }

  /**
   * Ensure output directory exists
   */
  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log(colors.dim(`📁 Created output directory: ${this.outputDir}`));
    }
  }

  /**
   * Generate test file name
   */
  private getTestFileName(originalFileName: string): string {
    return `${originalFileName}.spec.ts`;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  // Handle help flag
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🧪 ImmoWächter Test Generator

Usage:
  npm run test:auto-gen -- <file-path>

Examples:
  npm run test:auto-gen -- app/components/PropertyCard.tsx
  npm run test:auto-gen -- app/page.tsx
  npm run test:auto-gen -- app/api/properties/route.ts

Environment Variables:
  ANTHROPIC_API_KEY - Required for Claude API access

Options:
  --help, -h    Show this help message
`);
    process.exit(0);
  }

  const filePath = args[0];
  
  if (!filePath) {
    console.error(status.error('File path is required'));
    process.exit(1);
  }

  // Check if file exists
  try {
    await fs.access(filePath);
  } catch {
    console.error(status.error(`File not found: ${filePath}`));
    process.exit(1);
  }

  const generator = new TestGenerator();
  await generator.generateTest(filePath);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { TestGenerator };
