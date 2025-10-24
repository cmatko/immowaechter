#!/usr/bin/env node

/**
 * 🎯 EINFACHER TEST: Pages laden ohne Auth Check
 * 
 * Testet:
 * 1. Server läuft
 * 2. Pages laden ohne Redirect zu Login
 * 3. Keine 404 Errors
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

console.log('🎯 EINFACHER TEST: Pages laden ohne Auth Check');
console.log('=' .repeat(50));

async function simpleTest() {
  let browser;
  let page;
  
  try {
    console.log('1️⃣ Browser starten...');
    browser = await chromium.launch({ 
      headless: true,
      slowMo: 0
    });
    
    page = await browser.newPage();
    
    console.log('2️⃣ Server Status prüfen...');
    const response = await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    if (!response || response.status() !== 200) {
      throw new Error(`Server nicht erreichbar: ${response?.status()}`);
    }
    
    console.log('✅ Server läuft auf Port 3000');
    
    console.log('3️⃣ Dashboard Page testen...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Prüfe ob URL sich geändert hat (Redirect zu Login)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      throw new Error('❌ Dashboard redirectet zu Login - Auth Check noch aktiv!');
    }
    
    console.log('✅ Dashboard lädt ohne Redirect');
    
    console.log('4️⃣ Critical Maintenances Page testen...');
    await page.goto(`${BASE_URL}/dashboard/critical-maintenances`, { waitUntil: 'networkidle' });
    
    // Prüfe ob URL sich geändert hat
    const criticalUrl = page.url();
    if (criticalUrl.includes('/login')) {
      throw new Error('❌ Critical Maintenances redirectet zu Login - Auth Check noch aktiv!');
    }
    
    console.log('✅ Critical Maintenances lädt ohne Redirect');
    
    console.log('5️⃣ Page Content prüfen...');
    
    // Warte kurz auf Content Loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Prüfe ob irgendein Content geladen ist (nicht nur Loading Screen)
    const hasContent = await page.evaluate(() => {
      const body = document.body;
      const text = body.innerText;
      
      // Prüfe ob es mehr als nur "Lädt..." ist
      return text.length > 100 && !text.includes('Lädt...');
    });
    
    if (!hasContent) {
      throw new Error('❌ Page zeigt nur Loading Screen - Content nicht geladen!');
    }
    
    console.log('✅ Page Content geladen');
    
    console.log('\n🎉 EINFACHER TEST ERFOLGREICH!');
    console.log('=' .repeat(50));
    console.log('✅ Server läuft auf Port 3000');
    console.log('✅ Dashboard Pages laden ohne Redirect');
    console.log('✅ Keine Auth Check Redirects');
    console.log('✅ Page Content wird geladen');
    console.log('=' .repeat(50));
    
    return true;
    
  } catch (error) {
    console.error('❌ EINFACHER TEST FEHLGESCHLAGEN:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Test ausführen
simpleTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ EINFACHER TEST ERFOLGREICH!');
      process.exit(0);
    } else {
      console.log('\n❌ EINFACHER TEST FEHLGESCHLAGEN!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });




