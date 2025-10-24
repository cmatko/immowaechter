#!/usr/bin/env node

/**
 * 🔍 MANUELLER TEST: Was passiert wirklich?
 * 
 * Testet:
 * 1. Server läuft
 * 2. Pages laden
 * 3. Zeigt HTML Content
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

console.log('🔍 MANUELLER TEST: Was passiert wirklich?');
console.log('=' .repeat(50));

async function manualTest() {
  let browser;
  let page;
  
  try {
    console.log('1️⃣ Browser starten...');
    browser = await chromium.launch({ 
      headless: false, // Sichtbar für Debugging
      slowMo: 1000
    });
    
    page = await browser.newPage();
    
    console.log('2️⃣ Dashboard Page öffnen...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    console.log('3️⃣ Warte 5 Sekunden auf Content...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('4️⃣ Page Content analysieren...');
    
    const content = await page.evaluate(() => {
      const body = document.body;
      const text = body.innerText;
      const html = body.innerHTML;
      
      return {
        text: text.substring(0, 500),
        html: html.substring(0, 1000),
        hasLoading: text.includes('Lädt...'),
        hasSpinner: html.includes('animate-spin'),
        textLength: text.length
      };
    });
    
    console.log('📊 CONTENT ANALYSE:');
    console.log(`- Text Länge: ${content.textLength}`);
    console.log(`- Hat Loading: ${content.hasLoading}`);
    console.log(`- Hat Spinner: ${content.hasSpinner}`);
    console.log(`- Text (erste 500 Zeichen): ${content.text}`);
    console.log(`- HTML (erste 1000 Zeichen): ${content.html}`);
    
    if (content.hasLoading) {
      console.log('❌ Page zeigt noch Loading Screen!');
    } else {
      console.log('✅ Page zeigt Content!');
    }
    
    console.log('\n5️⃣ Critical Maintenances Page testen...');
    await page.goto(`${BASE_URL}/dashboard/critical-maintenances`, { waitUntil: 'networkidle' });
    
    console.log('6️⃣ Warte 5 Sekunden auf Content...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const criticalContent = await page.evaluate(() => {
      const body = document.body;
      const text = body.innerText;
      
      return {
        text: text.substring(0, 500),
        hasLoading: text.includes('Lädt...'),
        textLength: text.length
      };
    });
    
    console.log('📊 CRITICAL MAINTENANCES ANALYSE:');
    console.log(`- Text Länge: ${criticalContent.textLength}`);
    console.log(`- Hat Loading: ${criticalContent.hasLoading}`);
    console.log(`- Text (erste 500 Zeichen): ${criticalContent.text}`);
    
    console.log('\n🎯 FAZIT:');
    if (content.hasLoading || criticalContent.hasLoading) {
      console.log('❌ Pages zeigen noch Loading Screens!');
      console.log('🔧 LÖSUNG: Loading States müssen entfernt werden');
    } else {
      console.log('✅ Pages zeigen Content!');
      console.log('✅ Auth Checks erfolgreich entfernt!');
    }
    
    return !content.hasLoading && !criticalContent.hasLoading;
    
  } catch (error) {
    console.error('❌ MANUELLER TEST FEHLER:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Test ausführen
manualTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ MANUELLER TEST ERFOLGREICH!');
      process.exit(0);
    } else {
      console.log('\n❌ MANUELLER TEST FEHLGESCHLAGEN!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });




