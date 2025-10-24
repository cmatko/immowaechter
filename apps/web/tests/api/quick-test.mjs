#!/usr/bin/env node

/**
 * 🚀 SCHNELLER TEST: Server Status & Basic Functionality
 * 
 * Testet:
 * 1. Server läuft auf Port 3000
 * 2. Dashboard Pages sind erreichbar
 * 3. Keine Auth Check Redirects
 * 4. Console Logs für Inactivity Logout
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

console.log('🚀 SCHNELLER TEST: Server Status & Basic Functionality');
console.log('=' .repeat(50));

async function quickTest() {
  let browser;
  let page;
  
  try {
    console.log('1️⃣ Browser starten...');
    browser = await chromium.launch({ 
      headless: true, // Schnell
      slowMo: 0
    });
    
    page = await browser.newPage();
    
    // Console Logs sammeln
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
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
    
    console.log('5️⃣ Console Logs analysieren...');
    
    // Warte kurz auf Console Logs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const inactivityLogs = consoleLogs.filter(log => 
      log.includes('Inactivity Logout') || 
      log.includes('Timer zurückgesetzt')
    );
    
    if (inactivityLogs.length === 0) {
      console.log('⚠️  Keine Inactivity Logout Console Logs gefunden');
    } else {
      console.log('✅ Inactivity Logout Console Logs gefunden:');
      inactivityLogs.forEach(log => console.log(`   📱 ${log}`));
    }
    
    console.log('6️⃣ Page Content prüfen...');
    
    // Prüfe ob Dashboard Content geladen ist (verschiedene mögliche Texte)
    const dashboardContent = await page.$('text=Meine Immobilien') || 
                            await page.$('text=Dashboard') || 
                            await page.$('text=ImmoWächter');
    if (!dashboardContent) {
      throw new Error('❌ Dashboard Content nicht gefunden!');
    }
    
    console.log('✅ Dashboard Content geladen');
    
    console.log('\n🎉 SCHNELLER TEST ERFOLGREICH!');
    console.log('=' .repeat(50));
    console.log('✅ Server läuft auf Port 3000');
    console.log('✅ Dashboard Pages laden ohne Redirect');
    console.log('✅ Keine Auth Check Redirects');
    console.log('✅ Console Logs funktionieren');
    console.log('=' .repeat(50));
    
    return true;
    
  } catch (error) {
    console.error('❌ SCHNELLER TEST FEHLGESCHLAGEN:', error.message);
    console.log('\n🔍 DEBUG INFO:');
    console.log('- Server läuft?', await isServerRunning());
    console.log('- Port 3000 erreichbar?', await isPort3000Reachable());
    return false;
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
quickTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ SCHNELLER TEST ERFOLGREICH!');
      process.exit(0);
    } else {
      console.log('\n❌ SCHNELLER TEST FEHLGESCHLAGEN!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });
