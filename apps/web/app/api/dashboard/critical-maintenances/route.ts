import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Critical maintenances API called');
    
    // Mock data based on our 10 Risk Alerts - only critical ones
    const criticalComponents = [
      {
        id: 'comp-1',
        propertyId: 'prop-1',
        propertyName: 'Wohnung Wien-Innere Stadt',
        propertyAddress: 'Stephansplatz 1, 1010 Wien',
        componentName: 'Elektrische Anlage',
        componentType: 'electrical',
        riskLevel: 'critical',
        daysOverdue: 45,
        nextMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comp-3',
        propertyId: 'prop-3',
        propertyName: 'Bürogebäude Graz',
        propertyAddress: 'Hauptplatz 12, 8010 Graz',
        componentName: 'Brandschutzanlage',
        componentType: 'fire_safety',
        riskLevel: 'critical',
        daysOverdue: 0,
        nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comp-5',
        propertyId: 'prop-5',
        propertyName: 'Bürogebäude Graz',
        propertyAddress: 'Hauptplatz 12, 8010 Graz',
        componentName: 'Aufzug',
        componentType: 'elevator',
        riskLevel: 'critical',
        daysOverdue: 15,
        nextMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comp-7',
        propertyId: 'prop-7',
        propertyName: 'Loft Wien-Leopoldstadt',
        propertyAddress: 'Praterstraße 45, 1020 Wien',
        componentName: 'Gasleitung',
        componentType: 'plumbing',
        riskLevel: 'critical',
        daysOverdue: 0,
        nextMaintenance: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comp-9',
        propertyId: 'prop-9',
        propertyName: 'Villa Vorarlberg',
        propertyAddress: 'Bergstraße 22, 6900 Bregenz',
        componentName: 'Solaranlage',
        componentType: 'heating',
        riskLevel: 'critical',
        daysOverdue: 30,
        nextMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    console.log(`Found ${criticalComponents.length} critical components`);
    console.log('Critical components processed:', criticalComponents.length);

    return NextResponse.json({
      success: true,
      data: criticalComponents
    });
  } catch (error) {
    console.error('Critical maintenances API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        data: null
      },
      { status: 500 }
    );
  }
}

