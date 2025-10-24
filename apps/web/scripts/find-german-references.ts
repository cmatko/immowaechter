/**
 * Script to find German references in the codebase
 * and suggest Austrian replacements
 */

import fs from 'fs';
import path from 'path';

const GERMAN_TO_AUSTRIAN_MAP = {
  // Legal References
  '§222 StGB': 'StGB §80 (AT)',
  '§229 StGB': 'StGB §83, §88 (AT)',
  'BGB': 'ABGB',
  'deutsches Recht': 'österreichisches Recht',
  
  // Institutions
  'SCHUFA': 'KSV1870',
  'KfW': 'aws (Austria Wirtschaftsservice)',
  'BAFA': 'Umweltförderung im Inland',
  
  // Cities
  'München': 'Wien',
  'Berlin': 'Graz',
  'Hamburg': 'Salzburg',
  'Köln': 'Linz',
  'Frankfurt': 'Innsbruck',
  'Stuttgart': 'Klagenfurt',
  'Düsseldorf': 'Steyr',
  'Leipzig': 'Wels',
  
  // Countries
  'Deutschland': 'Österreich',
  'Germany': 'Austria',
  
  // Legal Terms
  'deutsch': 'österreichisch',
  'german': 'austrian'
};

function findGermanReferences(dir: string): void {
  console.log('🔍 Searching for German references in:', dir);
  console.log('📋 Austrian replacements needed:\n');

  const files = getAllFiles(dir);
  let totalReplacements = 0;

  files.forEach(file => {
    if (file.includes('node_modules') || file.includes('.git')) return;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const foundReplacements: Array<{line: number, original: string, replacement: string}> = [];
      
      Object.entries(GERMAN_TO_AUSTRIAN_MAP).forEach(([german, austrian]) => {
        const regex = new RegExp(german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const matches = content.match(regex);
        
        if (matches) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(german.toLowerCase())) {
              foundReplacements.push({
                line: index + 1,
                original: german,
                replacement: austrian
              });
            }
          });
        }
      });

      if (foundReplacements.length > 0) {
        console.log(`📄 ${file}:`);
        foundReplacements.forEach(({line, original, replacement}) => {
          console.log(`   Line ${line}: "${original}" → "${replacement}"`);
          totalReplacements++;
        });
        console.log('');
      }
    } catch (error) {
      // Skip files that can't be read
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total replacements needed: ${totalReplacements}`);
  console.log(`   Files to update: ${files.filter(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return Object.keys(GERMAN_TO_AUSTRIAN_MAP).some(german => 
        content.toLowerCase().includes(german.toLowerCase())
      );
    } catch {
      return false;
    }
  }).length}`);
}

function getAllFiles(dir: string): string[] {
  let files: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(getAllFiles(fullPath));
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.md'))) {
        files.push(fullPath);
      }
    });
  } catch (error) {
    // Skip directories that can't be read
  }
  
  return files;
}

// Run the search
const appDir = path.join(process.cwd(), 'apps', 'web');
findGermanReferences(appDir);





