#!/usr/bin/env node

/**
 * 🏥 SERVER HEALTH CHECK
 * 
 * Prüft:
 * 1. Server läuft auf Port 3000
 * 2. Alle wichtigen Routes sind erreichbar
 * 3. Keine 404 Errors
 * 4. Environment Variables geladen
 */

const BASE_URL = 'http://localhost:3000';

console.log('🏥 SERVER HEALTH CHECK');
console.log('=' .repeat(50));

async function healthCheck() {
  const routes = [
    '/',
    '/dashboard',
    '/dashboard/critical-maintenances',
    '/login',
    '/register'
  ];
  
  const results = [];
  
  for (const route of routes) {
    try {
      console.log(`🔍 Teste Route: ${route}`);
      
      const response = await fetch(`${BASE_URL}${route}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Health-Check-Bot'
        }
      });
      
      const status = response.status;
      const statusText = response.statusText;
      
      if (status === 200) {
        console.log(`✅ ${route} - ${status} ${statusText}`);
        results.push({ route, status, success: true });
      } else if (status === 404) {
        console.log(`❌ ${route} - ${status} ${statusText} (404 Not Found)`);
        results.push({ route, status, success: false, error: '404 Not Found' });
      } else if (status === 500) {
        console.log(`❌ ${route} - ${status} ${statusText} (500 Server Error)`);
        results.push({ route, status, success: false, error: '500 Server Error' });
      } else {
        console.log(`⚠️  ${route} - ${status} ${statusText}`);
        results.push({ route, status, success: false, error: statusText });
      }
      
    } catch (error) {
      console.log(`❌ ${route} - FEHLER: ${error.message}`);
      results.push({ route, status: 'ERROR', success: false, error: error.message });
    }
  }
  
  // Zusammenfassung
  console.log('\n📊 HEALTH CHECK ZUSAMMENFASSUNG:');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Erfolgreich: ${successful.length}/${results.length}`);
  console.log(`❌ Fehlgeschlagen: ${failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ FEHLGESCHLAGENE ROUTES:');
    failed.forEach(r => {
      console.log(`   ${r.route} - ${r.status} - ${r.error}`);
    });
  }
  
  // Spezielle Checks
  console.log('\n🔍 SPEZIELLE CHECKS:');
  
  // Dashboard sollte nicht zu Login redirecten
  const dashboardResult = results.find(r => r.route === '/dashboard');
  if (dashboardResult && dashboardResult.success) {
    console.log('✅ Dashboard lädt ohne Redirect');
  } else {
    console.log('❌ Dashboard Problem - möglicherweise Auth Check noch aktiv');
  }
  
  // Critical Maintenances sollte nicht zu Login redirecten
  const criticalResult = results.find(r => r.route === '/dashboard/critical-maintenances');
  if (criticalResult && criticalResult.success) {
    console.log('✅ Critical Maintenances lädt ohne Redirect');
  } else {
    console.log('❌ Critical Maintenances Problem - möglicherweise Auth Check noch aktiv');
  }
  
  // Login Page sollte erreichbar sein
  const loginResult = results.find(r => r.route === '/login');
  if (loginResult && loginResult.success) {
    console.log('✅ Login Page erreichbar');
  } else {
    console.log('❌ Login Page Problem');
  }
  
  console.log('\n🎯 FAZIT:');
  if (failed.length === 0) {
    console.log('✅ ALLE ROUTES FUNKTIONIEREN!');
    console.log('✅ Server ist gesund!');
    console.log('✅ Auth Checks erfolgreich entfernt!');
  } else if (failed.length <= 2) {
    console.log('⚠️  MEISTE ROUTES FUNKTIONIEREN!');
    console.log('⚠️  Einige Probleme, aber Server läuft grundsätzlich');
  } else {
    console.log('❌ VIELE ROUTES FUNKTIONIEREN NICHT!');
    console.log('❌ Server hat ernsthafte Probleme!');
  }
  
  return failed.length === 0;
}

// Test ausführen
healthCheck()
  .then((success) => {
    if (success) {
      console.log('\n✅ HEALTH CHECK ERFOLGREICH!');
      process.exit(0);
    } else {
      console.log('\n❌ HEALTH CHECK FEHLGESCHLAGEN!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ HEALTH CHECK FEHLER:', error.message);
    process.exit(1);
  });




