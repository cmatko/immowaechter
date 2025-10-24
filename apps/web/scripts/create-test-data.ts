/**
 * Test Data Generator für ImmoWächter
 * Erstellt 10 realistische Testdatensätze für Immobilien
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
);

const testProperties = [
  {
    name: "Wohnung Wien-Innere Stadt",
    address: "Stephansplatz 1",
    postal_code: "1010",
    city: "Wien",
    property_type: "apartment",
    construction_year: 2015,
    living_area: 85,
    user_id: "temp-user-id"
  },
  {
    name: "Einfamilienhaus Salzburg",
    address: "Mozartplatz 5",
    postal_code: "5020",
    city: "Salzburg", 
    property_type: "house",
    construction_year: 1998,
    living_area: 150,
    user_id: "temp-user-id"
  },
  {
    name: "Bürogebäude Graz",
    address: "Hauptplatz 12",
    postal_code: "8010",
    city: "Graz",
    property_type: "commercial",
    construction_year: 2010,
    living_area: 300,
    user_id: "temp-user-id"
  },
  {
    name: "Ferienhaus Tirol",
    address: "Alpenstraße 8",
    postal_code: "6020",
    city: "Innsbruck",
    property_type: "house",
    construction_year: 2005,
    living_area: 120,
    user_id: "temp-user-id"
  },
  {
    name: "Geschäftslokal Linz",
    address: "Landstraße 25",
    postal_code: "4020",
    city: "Linz",
    property_type: "commercial",
    construction_year: 2012,
    living_area: 80,
    user_id: "temp-user-id"
  },
  {
    name: "Wohnung Wien-Döbling",
    address: "Grinzinger Straße 15",
    postal_code: "1190",
    city: "Wien",
    property_type: "apartment",
    construction_year: 2020,
    living_area: 95,
    user_id: "temp-user-id"
  },
  {
    name: "Bauernhof Niederösterreich",
    address: "Dorfstraße 3",
    postal_code: "3100",
    city: "St. Pölten",
    property_type: "house",
    construction_year: 1985,
    living_area: 200,
    user_id: "temp-user-id"
  },
  {
    name: "Loft Wien-Leopoldstadt",
    address: "Praterstraße 45",
    postal_code: "1020",
    city: "Wien",
    property_type: "apartment",
    construction_year: 2018,
    living_area: 110,
    user_id: "temp-user-id"
  },
  {
    name: "Studentenwohnheim Klagenfurt",
    address: "Universitätsstraße 7",
    postal_code: "9020",
    city: "Klagenfurt",
    property_type: "apartment",
    construction_year: 2015,
    living_area: 35,
    user_id: "temp-user-id"
  },
  {
    name: "Villa Vorarlberg",
    address: "Bergstraße 22",
    postal_code: "6900",
    city: "Bregenz",
    property_type: "house",
    construction_year: 2000,
    living_area: 180,
    user_id: "temp-user-id"
  }
];

const testComponents = [
  {
    component_name: "Heizungsanlage",
    component_type: "heating",
    brand: "Viessmann",
    model: "Vitodens 200-W",
    installation_date: "2020-01-15",
    last_maintenance: "2023-06-15",
    next_maintenance: "2024-06-15",
    risk_level: "medium",
    is_active: true
  },
  {
    component_name: "Elektrische Anlage",
    component_type: "electrical",
    brand: "ABB",
    model: "S200",
    installation_date: "2018-03-20",
    last_maintenance: "2023-09-10",
    next_maintenance: "2024-09-10",
    risk_level: "critical",
    is_active: true
  },
  {
    component_name: "Wasserversorgung",
    component_type: "plumbing",
    brand: "Grohe",
    model: "Eurosmart",
    installation_date: "2019-05-10",
    last_maintenance: "2023-11-05",
    next_maintenance: "2024-11-05",
    risk_level: "low",
    is_active: true
  },
  {
    component_name: "Brandschutzanlage",
    component_type: "fire_safety",
    brand: "Bosch",
    model: "FPA-5000",
    installation_date: "2021-02-28",
    last_maintenance: "2023-08-15",
    next_maintenance: "2024-02-28",
    risk_level: "legal",
    is_active: true
  },
  {
    component_name: "Aufzug",
    component_type: "elevator",
    brand: "Schindler",
    model: "3300",
    installation_date: "2017-11-12",
    last_maintenance: "2023-10-20",
    next_maintenance: "2024-04-20",
    risk_level: "critical",
    is_active: true
  }
];

const testMaintenances = [
  {
    maintenance_type_id: 1,
    status: "pending",
    next_due: "2024-03-15",
    last_completed: null,
    notes: "Jährliche Wartung der Heizungsanlage"
  },
  {
    maintenance_type_id: 2,
    status: "overdue",
    next_due: "2023-12-01",
    last_completed: "2022-12-01",
    notes: "Elektrische Sicherheitsprüfung überfällig"
  },
  {
    maintenance_type_id: 3,
    status: "pending",
    next_due: "2024-06-01",
    last_completed: "2023-06-01",
    notes: "Wasserversorgung Inspektion"
  },
  {
    maintenance_type_id: 4,
    status: "pending",
    next_due: "2024-02-15",
    last_completed: "2023-02-15",
    notes: "Brandschutzanlage Wartung"
  },
  {
    maintenance_type_id: 5,
    status: "overdue",
    next_due: "2023-11-01",
    last_completed: "2022-11-01",
    notes: "Aufzug Wartung überfällig"
  }
];

async function createTestData() {
  console.log('🚀 Erstelle Testdatensätze für ImmoWächter...');
  
  try {
    // 1. Erstelle Properties
    console.log('📋 Erstelle 10 Test-Immobilien...');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .insert(testProperties)
      .select();
    
    if (propertiesError) {
      console.error('❌ Fehler beim Erstellen der Properties:', propertiesError);
      return;
    }
    
    console.log(`✅ ${properties?.length} Properties erstellt`);
    
    // 2. Erstelle Components für jede Property
    console.log('🔧 Erstelle Components für jede Property...');
    const allComponents = [];
    
    for (const property of properties || []) {
      for (const component of testComponents) {
        allComponents.push({
          ...component,
          property_id: property.id,
          user_id: "temp-user-id"
        });
      }
    }
    
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .insert(allComponents)
      .select();
    
    if (componentsError) {
      console.error('❌ Fehler beim Erstellen der Components:', componentsError);
      return;
    }
    
    console.log(`✅ ${components?.length} Components erstellt`);
    
    // 3. Erstelle Maintenances für jede Property
    console.log('📅 Erstelle Maintenances für jede Property...');
    const allMaintenances = [];
    
    for (const property of properties || []) {
      for (const maintenance of testMaintenances) {
        allMaintenances.push({
          ...maintenance,
          property_id: property.id,
          user_id: "temp-user-id"
        });
      }
    }
    
    const { data: maintenances, error: maintenancesError } = await supabase
      .from('maintenances')
      .insert(allMaintenances)
      .select();
    
    if (maintenancesError) {
      console.error('❌ Fehler beim Erstellen der Maintenances:', maintenancesError);
      return;
    }
    
    console.log(`✅ ${maintenances?.length} Maintenances erstellt`);
    
    // 4. Erstelle Notifications
    console.log('🔔 Erstelle Test-Notifications...');
    const testNotifications = [
      {
        user_id: "temp-user-id",
        type: "critical",
        title: "Wartung überfällig",
        message: "Elektrische Anlage in Wohnung Wien-Innere Stadt ist seit 45 Tagen überfällig",
        action_url: "/properties/1",
        read: false
      },
      {
        user_id: "temp-user-id", 
        type: "warning",
        title: "Wartung fällig",
        message: "Heizungsanlage in Einfamilienhaus Salzburg muss in 3 Tagen gewartet werden",
        action_url: "/properties/2",
        read: false
      },
      {
        user_id: "temp-user-id",
        type: "info",
        title: "Neue Inspektion geplant",
        message: "Brandschutzanlage in Bürogebäude Graz wird in 2 Wochen inspiziert",
        action_url: "/properties/3",
        read: false
      }
    ];
    
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .insert(testNotifications)
      .select();
    
    if (notificationsError) {
      console.error('❌ Fehler beim Erstellen der Notifications:', notificationsError);
      return;
    }
    
    console.log(`✅ ${notifications?.length} Notifications erstellt`);
    
    console.log('🎉 Alle Testdatensätze erfolgreich erstellt!');
    console.log('\n📊 ZUSAMMENFASSUNG:');
    console.log(`   • ${properties?.length} Immobilien`);
    console.log(`   • ${components?.length} Komponenten`);
    console.log(`   • ${maintenances?.length} Wartungen`);
    console.log(`   • ${notifications?.length} Benachrichtigungen`);
    
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Testdaten:', error);
  }
}

// Führe das Script aus
createTestData();
