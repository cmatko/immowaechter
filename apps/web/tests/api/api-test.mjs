#!/usr/bin/env node

/**
 * 🔥 API TEST
 * 
 * Testet:
 * 1. Critical Maintenances API direkt aufrufen
 * 2. Prüft ob API 200 statt 401 zurückgibt
 */

const BASE_URL = 'http://localhost:3000';

console.log('🔥 API TEST');
console.log('=' .repeat(50));

async function apiTest() {
  try {
    console.log('1️⃣ Critical Maintenances API testen...');
    
    const response = await fetch(`${BASE_URL}/api/dashboard/critical-maintenances`);
    const status = response.status;
    const data = await response.json();
    
    console.log(`📊 API Status: ${status}`);
    console.log(`📊 API Response:`, JSON.stringify(data, null, 2));
    
    if (status === 200) {
      console.log('✅ API gibt 200 zurück');
    } else if (status === 401) {
      console.log('❌ API gibt 401 zurück - Auth Problem');
    } else {
      console.log(`⚠️  API gibt ${status} zurück`);
    }
    
    if (data.success && Array.isArray(data.data)) {
      console.log(`✅ API gibt ${data.data.length} kritische Wartungen zurück`);
    } else {
      console.log('⚠️  API Response Format unerwartet');
    }
    
    console.log('\n🎯 API TEST ZUSAMMENFASSUNG:');
    console.log('=' .repeat(50));
    
    if (status === 200) {
      console.log('✅ API funktioniert korrekt');
      console.log(`✅ ${data.data?.length || 0} kritische Wartungen gefunden`);
    } else {
      console.log('❌ API funktioniert nicht korrekt');
    }
    
    console.log('=' .repeat(50));
    
    return status === 200;
    
  } catch (error) {
    console.error('❌ API TEST FEHLER:', error.message);
    return false;
  }
}

// Test ausführen
apiTest()
  .then((success) => {
    if (success) {
      console.log('\n✅ API TEST ERFOLGREICH!');
      console.log('✅ API funktioniert ohne Auth Errors');
      process.exit(0);
    } else {
      console.log('\n❌ API TEST FEHLGESCHLAGEN!');
      console.log('❌ API gibt nicht 200 zurück');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ TEST FEHLER:', error.message);
    process.exit(1);
  });




