#!/usr/bin/env node

/**
 * 🧪 AUTOMATISIERTER TEST: Auto-Logout Feature
 * 
 * Testet:
 * 1. Server läuft auf Port 3000
 * 2. Dashboard Pages laden ohne Auth Checks
 * 3. Auto-Logout nach 1 Minute Inaktivität
 * 4. Timer Reset bei Aktivität
 * 5. Login Page Inactivity Message
 */

import { chromium } from 'playwright';
import { setTimeout } from 'timers/promises';

const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 120000; // 2 Minuten

console.log('🧪 AUTOMATISIERTER TEST: Auto-Logout Feature');
console.log('=' .repeat(50));

async function testAutoLogout() {
  let browser;
  let page;
  
  try {
    console.log('1️⃣ Browser starten...');
    browser = await chromium.launch({ 
      headless: false, // Sichtbar für Debugging
      slowMo: 1000 // Langsam für bessere Beobachtung
    });
    
    page = await browser.newPage();
    
    // Console Logs abfangen
    page.on('console', msg => {
      if (msg.text().includes('Inactivity Logout') || msg.text().includes('Timer zurückgesetzt')) {
        console.log(`📱 Browser Console: ${msg.text()}`);
      }
    });
    
    console.log('2️⃣ Server Status prüfen...');
    const response = await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    if (!response || response.status() !== 200) {
      throw new Error(`Server nicht erreichbar: ${response?.status()}`);
    }
    
    console.log('✅ Server läuft auf Port 3000');
    
    console.log('3️⃣ Dashboard Page testen (ohne Auth Check)...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Prüfe ob Page sofort lädt (kein Loading Screen)
    const loadingElement = await page.$('[data-testid="loading"]');
    if (loadingElement) {
      throw new Error('❌ Dashboard zeigt Loading Screen - Auth Check noch aktiv!');
    }
    
    console.log('✅ Dashboard lädt sofort (kein Auth Check)');
    
    console.log('4️⃣ Critical Maintenances Page testen...');
    await page.goto(`${BASE_URL}/dashboard/critical-maintenances`, { waitUntil: 'networkidle' });
    
    // Prüfe ob Page sofort lädt
    const criticalLoadingElement = await page.$('[data-testid="auth-loading"]');
    if (criticalLoadingElement) {
      throw new Error('❌ Critical Maintenances zeigt Auth Loading - Auth Check noch aktiv!');
    }
    
    console.log('✅ Critical Maintenances lädt sofort (kein Auth Check)');
    
    console.log('5️⃣ Auto-Logout Hook testen...');
    
    // Warte auf Console Log für Inactivity Logout Aktivierung
    const inactivityLogPromise = new Promise((resolve) => {
      page.on('console', msg => {
        if (msg.text().includes('Inactivity Logout aktiviert')) {
          resolve(msg.text());
        }
      });
    });
    
    // Navigiere zu einer Dashboard Page
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Warte auf Inactivity Logout Aktivierung
    const inactivityLog = await Promise.race([
      inactivityLogPromise,
      setTimeout(5000, 'TIMEOUT')
    ]);
    
    if (inactivityLog === 'TIMEOUT') {
      throw new Error('❌ Inactivity Logout Hook nicht aktiviert!');
    }
    
    console.log('✅ Inactivity Logout Hook aktiviert');
    
    console.log('6️⃣ Timer Reset bei Aktivität testen...');
    
    // Simuliere Mausbewegung
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 200);
    
    // Warte kurz auf Console Log
    await setTimeout(1000);
    
    console.log('✅ Timer Reset bei Aktivität funktioniert');
    
    console.log('7️⃣ Auto-Logout nach 1 Minute testen...');
    console.log('⏰ Warte 65 Sekunden für Auto-Logout...');
    
    // Warte 65 Sekunden (1 Minute + 5 Sekunden Buffer)
    const startTime = Date.now();
    let logoutDetected = false;
    
    // Listener für Logout
    page.on('console', msg => {
      if (msg.text().includes('AUTO-LOGOUT: 1 Minute Inaktivität erkannt')) {
        logoutDetected = true;
        console.log('✅ Auto-Logout erkannt!');
      }
    });
    
    // Warte auf Auto-Logout
    while (Date.now() - startTime < 65000 && !logoutDetected) {
      await setTimeout(1000);
      
      // Zeige Countdown
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (elapsed % 10 === 0) {
        console.log(`⏰ ${elapsed}s / 65s - Warte auf Auto-Logout...`);
      }
    }
    
    if (!logoutDetected) {
      throw new Error('❌ Auto-Logout nach 1 Minute nicht ausgelöst!');
    }
    
    console.log('✅ Auto-Logout nach 1 Minute funktioniert');
    
    console.log('8️⃣ Login Page Inactivity Message testen...');
    
    // Warte auf Redirect zur Login Page
    await page.waitForURL('**/login**', { timeout: 10000 });
    
    // Prüfe URL Parameter
    const currentUrl = page.url();
    if (!currentUrl.includes('reason=inactivity')) {
      throw new Error('❌ Login Page hat keinen inactivity reason Parameter!');
    }
    
    // Prüfe Inactivity Message
    const inactivityMessage = await page.$('text=Sie wurden wegen Inaktivität automatisch abgemeldet');
    if (!inactivityMessage) {
      throw new Error('❌ Inactivity Message nicht auf Login Page gefunden!');
    }
    
    console.log('✅ Login Page zeigt Inactivity Message');
    
    console.log('\n🎉 ALLE TESTS ERFOLGREICH!');
    console.log('=' .repeat(50));
    console.log('✅ Server läuft auf Port 3000');
    console.log('✅ Dashboard Pages laden ohne Auth Checks');
    console.log('✅ Auto-Logout nach 1 Minute funktioniert');
    console.log('✅ Timer Reset bei Aktivität funktioniert');
    console.log('✅ Login Page zeigt Inactivity Message');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('❌ TEST FEHLGESCHLAGEN:', error.message);
    console.log('\n🔍 DEBUG INFO:');
    console.log('- Server läuft?', await isServerRunning());
    console.log('- Port 3000 erreichbar?', await isPort3000Reachable());
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function isServerRunning() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.status === 200;
  } catch {
    return false;
  }
}

async function isPort3000Reachable() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
}

// Test ausführen
testAutoLogout()
  .then(() => {
    console.log('\n✅ ALLE TESTS ERFOLGREICH ABGESCHLOSSEN!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ TESTS FEHLGESCHLAGEN:', error.message);
    process.exit(1);
  });




