import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    
    // Mock data for now - replace with real Supabase when ready
    const mockAlerts = [
      {
        id: 'alert-1',
        type: 'critical',
        title: 'Wartung überfällig',
        message: 'Elektrische Anlage ist seit 45 Tagen überfällig',
        propertyId: 'prop-1',
        propertyName: 'Wohnung Wien-Innere Stadt',
        componentId: 'comp-1',
        componentName: 'Elektrische Anlage',
        severity: 9,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-1'
      },
      {
        id: 'alert-2',
        type: 'warning',
        title: 'Wartung fällig',
        message: 'Heizungsanlage muss in 3 Tagen gewartet werden',
        propertyId: 'prop-2',
        propertyName: 'Einfamilienhaus Salzburg',
        componentId: 'comp-2',
        componentName: 'Heizungsanlage',
        severity: 6,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-2'
      },
      {
        id: 'alert-3',
        type: 'critical',
        title: 'Hohes Risiko',
        message: 'Brandschutzanlage hat ein rechtliches Risiko',
        propertyId: 'prop-3',
        propertyName: 'Bürogebäude Graz',
        componentId: 'comp-3',
        componentName: 'Brandschutzanlage',
        severity: 10,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-3'
      },
      {
        id: 'alert-4',
        type: 'warning',
        title: 'Wartung fällig',
        message: 'Wasserversorgung in Ferienhaus Tirol muss in 7 Tagen gewartet werden',
        propertyId: 'prop-4',
        propertyName: 'Ferienhaus Tirol',
        componentId: 'comp-4',
        componentName: 'Wasserversorgung',
        severity: 5,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-4'
      },
      {
        id: 'alert-5',
        type: 'critical',
        title: 'Wartung überfällig',
        message: 'Aufzug in Bürogebäude Graz ist seit 15 Tagen überfällig',
        propertyId: 'prop-5',
        propertyName: 'Bürogebäude Graz',
        componentId: 'comp-5',
        componentName: 'Aufzug',
        severity: 8,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-5'
      },
      {
        id: 'alert-6',
        type: 'warning',
        title: 'Alte Wartung',
        message: 'Dach in Bauernhof Niederösterreich wurde vor 2 Jahren zuletzt gewartet',
        propertyId: 'prop-6',
        propertyName: 'Bauernhof Niederösterreich',
        componentId: 'comp-6',
        componentName: 'Dach',
        severity: 4,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-6'
      },
      {
        id: 'alert-7',
        type: 'critical',
        title: 'Hohes Risiko',
        message: 'Gasleitung in Loft Wien-Leopoldstadt hat ein kritisches Risiko',
        propertyId: 'prop-7',
        propertyName: 'Loft Wien-Leopoldstadt',
        componentId: 'comp-7',
        componentName: 'Gasleitung',
        severity: 9,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-7'
      },
      {
        id: 'alert-8',
        type: 'warning',
        title: 'Wartung fällig',
        message: 'Klimaanlage in Studentenwohnheim Klagenfurt muss in 5 Tagen gewartet werden',
        propertyId: 'prop-8',
        propertyName: 'Studentenwohnheim Klagenfurt',
        componentId: 'comp-8',
        componentName: 'Klimaanlage',
        severity: 6,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-8'
      },
      {
        id: 'alert-9',
        type: 'critical',
        title: 'Wartung überfällig',
        message: 'Solaranlage in Villa Vorarlberg ist seit 30 Tagen überfällig',
        propertyId: 'prop-9',
        propertyName: 'Villa Vorarlberg',
        componentId: 'comp-9',
        componentName: 'Solaranlage',
        severity: 7,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-9'
      },
      {
        id: 'alert-10',
        type: 'warning',
        title: 'Wartung fällig',
        message: 'Alarmanlage in Geschäftslokal Linz muss in 2 Tagen gewartet werden',
        propertyId: 'prop-10',
        propertyName: 'Geschäftslokal Linz',
        componentId: 'comp-10',
        componentName: 'Alarmanlage',
        severity: 5,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        actionUrl: '/dashboard/properties/prop-10'
      }
    ];
    
    // Filter by property if specified
    const filteredAlerts = propertyId 
      ? mockAlerts.filter(alert => alert.propertyId === propertyId)
      : mockAlerts;
    
    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      total: filteredAlerts.length,
      critical: filteredAlerts.filter(a => a.type === 'critical').length,
      warning: filteredAlerts.filter(a => a.type === 'warning').length,
      info: filteredAlerts.filter(a => a.type === 'info').length
    });
    
  } catch (error) {
    console.error('Risk alerts API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch risk alerts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
