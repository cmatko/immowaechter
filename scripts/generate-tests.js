const fs = require('fs');
const path = require('path');

const projectRoot = __dirname.replace(/scripts$/, '');
const webAppDir = path.join(projectRoot, 'apps', 'web');
const appDir = path.join(webAppDir, 'app');
const e2eDir = path.join(projectRoot, 'e2e');

console.log('🔍 Scanning pages in apps/web/app...');

if (!fs.existsSync(appDir)) {
  console.log('❌ apps/web/app/ directory not found!');
  console.log('   Checked:', appDir);
  process.exit(1);
}

// Erstelle e2e/ falls nicht vorhanden
if (!fs.existsSync(e2eDir)) {
  fs.mkdirSync(e2eDir, { recursive: true });
}

function scanDirectory(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const routePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      // Rekursiv scannen
      if (!entry.name.startsWith('_') && !entry.name.startsWith('.')) {
        scanDirectory(fullPath, routePath);
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
      generateTest(routePath, basePath);
    }
  }
}

function generateTest(filePath, routePath) {
  // Konvertiere Dateipfad zu URL-Pfad
  let urlPath = routePath
    .replace(/\\/g, '/')  // Windows Backslashes
    .replace(/\(.*?\)/g, '') // Route Groups entfernen
    .replace(/page\.(tsx|js)$/, ''); // page.tsx entfernen
  
  // Root-Route speziell behandeln
  if (!urlPath || urlPath === '/') {
    urlPath = '/';
  } else if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }
  
  // Entferne trailing slash außer bei root
  if (urlPath !== '/' && urlPath.endsWith('/')) {
    urlPath = urlPath.slice(0, -1);
  }

  // Test-Dateiname basierend auf Route
  const testFileName = urlPath === '/' 
    ? 'home.spec.ts'
    : urlPath.replace(/\//g, '-').slice(1) + '.spec.ts';
  
  const testFilePath = path.join(e2eDir, testFileName);
  
  // Überspringe wenn Test bereits existiert
  if (fs.existsSync(testFilePath)) {
    console.log(`⏭️  Skipping ${testFileName} (already exists)`);
    return;
  }

  const testContent = `import { test, expect } from '@playwright/test';

test.describe('${urlPath}', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('${urlPath}');
    
    // Warte auf Netzwerk-Idle
    await page.waitForLoadState('networkidle');
    
    // Prüfe dass Seite geladen wurde
    await expect(page).not.toHaveTitle(/Error|404/i);
  });

  test('should have valid HTML structure', async ({ page }) => {
    await page.goto('${urlPath}');
    
    // Prüfe grundlegende HTML-Elemente
    const html = await page.locator('html').first();
    await expect(html).toBeVisible();
  });
});
`;

  fs.writeFileSync(testFilePath, testContent);
  console.log(`✅ Generated: ${testFileName}`);
}

// Start scanning
console.log('📁 Scanning from:', appDir);
scanDirectory(appDir);
console.log('\n🎉 Test generation complete!');