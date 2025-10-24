#!/usr/bin/env node

/**
 * 🔐 AUTH TEST: Login Redirect funktioniert
 * 
 * Testet:
 * 1. Nicht eingeloggte User werden zu Login weitergeleitet
 * 2. Dashboard zeigt Auth Check
 * 3. Keine Supabase Errors
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

console.log('🔐 AUTH TEST: Login Redirect funktioniert');
console.log('=' .repeat(50));

async function authTest() {
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
    
    console.log('2️⃣ Dashboard ohne Login öffnen...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    console.log('3️⃣ Warte 3 Sekunden auf Auth Check...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('4️⃣ URL prüfen...');
    const currentUrl = page.url();
    console.log(`📊 Aktuelle URL: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('✅ User wurde zu Login weitergeleitet!');
    } else if (currentUrl.includes('/dashboard')) {
      console.log('⚠️  User ist noch auf Dashboard - Auth Check funktioniert nicht');
    } else {
      console.log(`⚠️  Unerwartete URL: ${currentUrl}`);
    }
    
    console.log('5️⃣ Console Logs analysieren...');
    const authLogs = consoleLogs.filter(log => 
      log.includes('Session') || 
      log.includes('Auth') ||
      log.includes('Login') ||
      log.includes('Redirect')
    );
    
    if (authLogs.length > 0) {
      console.log('✅ Auth Console Logs gefunden:');
      authLogs.forEach(log => console.log(`   📱 ${log}`));
    } else {
      console.log('⚠️  Keine Auth Console Logs gefunden');
    }
    
    console.log('6️⃣ Error Logs prüfen...');
    const errorLogs = consoleLogs.filter(log => 
      log.includes('Error') || 
      log.includes('supabaseKey') ||
      log.includes('required')
    );
    
    if (errorLogs.length > 0) {
      console.log('❌ Error Logs gefunden:');
      errorLogs.forEach(log => console.log(`   ❌ ${log}`));
    } else {
      console.log('✅ Keine Error Logs gefunden');
    }
    
    console.log('\n🎯 AUTH TEST ZUSAMMENFASSUNG:');
    console.log('=' .repeat(50));
    
    if (currentUrl.includes('/login')) {
      console.log('✅ Auth Check funktioniert - User wird zu Login weitergeleitet');
    } else {
      console.log('❌ Auth Check funktioniert nicht - User bleibt auf Dashboard');
    }
    
    if (errorLogs.length === 0) {
      console.log('✅ Keine Supabase Errors');
    } else {
      console.log('❌ Supabase Errors gefunden');
    }
    
    if (authLogs.length > 0) {
      console.log('✅ Auth Console Logs funktionieren');
    } else {
      console.log('⚠️  Keine Auth Console Logs');
    }
    
    console.log('=' .repeat(50));
    
    return currentUrl.includes('/login') && errorLogs.length === 0;
    
  } catch (error) {
    console.error('❌ AUTH TEST FEHLER:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Test ausführen
authTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ AUTH TEST ERFOLGREICH!');
      console.log('✅ User wird korrekt zu Login weitergeleitet');
      console.log('✅ Keine Supabase Errors');
      process.exit(0);
    } else {
      console.log('\n❌ AUTH TEST FEHLGESCHLAGEN!');
      console.log('❌ Auth Check funktioniert nicht korrekt');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });




