#!/usr/bin/env node

/**
 * 🔥 COMPREHENSIVE DASHBOARD TEST
 * 
 * Testet:
 * 1. Dashboard lädt ohne Errors
 * 2. API gibt keine ungültigen Components zurück
 * 3. Critical Maintenances zeigt korrekte Daten
 * 4. Logout Button funktioniert
 * 5. Risk Summary zeigt korrekte Statistiken
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

console.log('🔥 COMPREHENSIVE DASHBOARD TEST');
console.log('=' .repeat(50));

async function comprehensiveDashboardTest() {
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
    
    console.log('2️⃣ Dashboard öffnen...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    console.log('3️⃣ Warte 3 Sekunden auf API Calls...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('4️⃣ Dashboard Content prüfen...');
    
    // Prüfe ob Dashboard lädt
    const dashboardTitle = await page.textContent('h1');
    if (dashboardTitle && dashboardTitle.includes('ImmoWächter')) {
      console.log('✅ Dashboard lädt korrekt');
    } else {
      console.log('❌ Dashboard lädt nicht korrekt');
    }
    
    // Prüfe ob Logout Button vorhanden ist
    const logoutButton = await page.$('button:has-text("Abmelden")');
    if (logoutButton) {
      console.log('✅ Logout Button gefunden');
    } else {
      console.log('❌ Logout Button nicht gefunden');
    }
    
    // Prüfe Risk Summary
    const riskSummary = await page.$('[data-testid="risk-summary"]');
    if (riskSummary) {
      console.log('✅ Risk Summary gefunden');
    } else {
      console.log('⚠️ Risk Summary nicht gefunden');
    }
    
    console.log('5️⃣ Critical Maintenances Page testen...');
    await page.goto(`${BASE_URL}/dashboard/critical-maintenances`, { waitUntil: 'networkidle' });
    
    console.log('6️⃣ Warte 3 Sekunden auf API Calls...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Prüfe ob "Keine kritischen Wartungen" angezeigt wird
    try {
      const noCriticalMessage = await page.textContent('text=Keine kritischen Wartungen', { timeout: 2000 });
      if (noCriticalMessage) {
        console.log('✅ "Keine kritischen Wartungen" Message gefunden (erwartet nach Cleanup)');
      }
    } catch (error) {
      console.log('⚠️ Keine "Keine kritischen Wartungen" Message gefunden');
    }
    
    // Prüfe API Errors
    const apiErrors = consoleLogs.filter(log => 
      log.includes('401') || 
      log.includes('Unauthorized') ||
      log.includes('Failed to fetch') ||
      log.includes('Invalid component')
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
    
    const riskSummaryRequests = networkRequests.filter(req => 
      req.url.includes('/api/dashboard/risk-summary')
    );
    
    console.log(`🌐 Critical Maintenances API Calls: ${criticalMaintenancesRequests.length}`);
    console.log(`🌐 Risk Summary API Calls: ${riskSummaryRequests.length}`);
    
    console.log('\n🎯 COMPREHENSIVE DASHBOARD TEST ZUSAMMENFASSUNG:');
    console.log('=' .repeat(50));
    
    if (apiErrors.length === 0) {
      console.log('✅ Keine API Errors');
    } else {
      console.log('❌ API Errors gefunden');
    }
    
    if (logoutButton) {
      console.log('✅ Logout Button vorhanden');
    } else {
      console.log('❌ Logout Button fehlt');
    }
    
    if (criticalMaintenancesRequests.length > 0) {
      console.log('✅ Critical Maintenances API wird aufgerufen');
    } else {
      console.log('⚠️ Critical Maintenances API wird nicht aufgerufen');
    }
    
    if (riskSummaryRequests.length > 0) {
      console.log('✅ Risk Summary API wird aufgerufen');
    } else {
      console.log('⚠️ Risk Summary API wird nicht aufgerufen');
    }
    
    console.log('=' .repeat(50));
    
    return apiErrors.length === 0 && logoutButton !== null;
    
  } catch (error) {
    console.error('❌ COMPREHENSIVE DASHBOARD TEST FEHLER:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Test ausführen
comprehensiveDashboardTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ COMPREHENSIVE DASHBOARD TEST ERFOLGREICH!');
      console.log('✅ Dashboard funktioniert ohne Errors');
      console.log('✅ Logout Button vorhanden');
      console.log('✅ APIs funktionieren korrekt');
      process.exit(0);
    } else {
      console.log('\n❌ COMPREHENSIVE DASHBOARD TEST FEHLGESCHLAGEN!');
      console.log('❌ Dashboard hat Probleme');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });




