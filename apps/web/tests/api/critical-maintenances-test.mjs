#!/usr/bin/env node

/**
 * 🔥 CRITICAL MAINTENANCES TEST
 * 
 * Testet:
 * 1. Critical Maintenances Page lädt
 * 2. API gibt keine 401 Errors
 * 3. Kritische Wartungen werden angezeigt
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

console.log('🔥 CRITICAL MAINTENANCES TEST');
console.log('=' .repeat(50));

async function criticalMaintenancesTest() {
  let browser;
  let page;
  
  try {
    console.log('1️⃣ Browser starten...');
    browser = await chromium.launch({ 
      headless: false, // Sichtbar für Debugging
      slowMo: 1000
    });
    
    page = await browser.newPage();
    
    // Console Logs sammeln
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
      console.log(`📱 Console: ${msg.text()}`);
    });
    
    // Page Errors sammeln
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Network Requests sammeln
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        networkRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`🌐 API Response: ${response.status()} ${response.url()}`);
      }
    });
    
    console.log('2️⃣ Critical Maintenances Page öffnen...');
    await page.goto(`${BASE_URL}/dashboard/critical-maintenances`, { waitUntil: 'networkidle' });
    
    console.log('3️⃣ Warte 3 Sekunden auf API Calls...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('4️⃣ Page Content prüfen...');
    const pageContent = await page.content();
    
    // Prüfe ob "Keine kritischen Wartungen" angezeigt wird
    const noCriticalMessage = await page.textContent('text=Keine kritischen Wartungen');
    if (noCriticalMessage) {
      console.log('⚠️  "Keine kritischen Wartungen" Message gefunden');
    } else {
      console.log('✅ Keine "Keine kritischen Wartungen" Message');
    }
    
    // Prüfe ob kritische Wartungen angezeigt werden
    const criticalItems = await page.$$('[data-testid="critical-component"]');
    console.log(`📊 Critical Components gefunden: ${criticalItems.length}`);
    
    // Prüfe API Errors
    const apiErrors = consoleLogs.filter(log => 
      log.includes('401') || 
      log.includes('Unauthorized') ||
      log.includes('Failed to fetch')
    );
    
    if (apiErrors.length > 0) {
      console.log('❌ API Errors gefunden:');
      apiErrors.forEach(log => console.log(`   ❌ ${log}`));
    } else {
      console.log('✅ Keine API Errors gefunden');
    }
    
    // Prüfe Network Requests
    const criticalMaintenancesRequests = networkRequests.filter(req => 
      req.url.includes('/api/dashboard/critical-maintenances')
    );
    
    console.log(`🌐 Critical Maintenances API Calls: ${criticalMaintenancesRequests.length}`);
    
    console.log('\n🎯 CRITICAL MAINTENANCES TEST ZUSAMMENFASSUNG:');
    console.log('=' .repeat(50));
    
    if (apiErrors.length === 0) {
      console.log('✅ Keine API Errors');
    } else {
      console.log('❌ API Errors gefunden');
    }
    
    if (criticalItems.length > 0) {
      console.log('✅ Critical Components werden angezeigt');
    } else {
      console.log('⚠️  Keine Critical Components angezeigt');
    }
    
    console.log('=' .repeat(50));
    
    return apiErrors.length === 0;
    
  } catch (error) {
    console.error('❌ CRITICAL MAINTENANCES TEST FEHLER:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Test ausführen
criticalMaintenancesTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ CRITICAL MAINTENANCES TEST ERFOLGREICH!');
      console.log('✅ API funktioniert ohne Errors');
      process.exit(0);
    } else {
      console.log('\n❌ CRITICAL MAINTENANCES TEST FEHLGESCHLAGEN!');
      console.log('❌ API Errors oder andere Probleme');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });




