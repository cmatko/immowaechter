import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    
    // Mock data for now - replace with real Supabase when ready
    const mockEvents = [
      {
        id: 'event-1',
        title: 'Wartung: Heizungsanlage',
        propertyId: 'prop-1',
        propertyName: 'Wohnung Wien-Innere Stadt',
        componentId: 'comp-1',
        componentName: 'Heizungsanlage',
        componentType: 'heating',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        type: 'maintenance',
        status: 'scheduled',
        priority: 'high',
        description: 'Regelmäßige Wartung der Heizungsanlage',
        estimatedDuration: 2,
        cost: 240
      },
      {
        id: 'event-2',
        title: 'Inspektion: Brandschutzanlage',
        propertyId: 'prop-2',
        propertyName: 'Einfamilienhaus Salzburg',
        componentId: 'comp-2',
        componentName: 'Brandschutzanlage',
        componentType: 'fire_safety',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
        type: 'inspection',
        status: 'scheduled',
        priority: 'critical',
        description: 'Sicherheitsinspektion der Brandschutzanlage',
        estimatedDuration: 1,
        cost: 600
      },
      {
        id: 'event-3',
        title: 'Austausch: Elektrische Anlage',
        propertyId: 'prop-3',
        propertyName: 'Bürogebäude Graz',
        componentId: 'comp-3',
        componentName: 'Elektrische Anlage',
        componentType: 'electrical',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        type: 'replacement',
        status: 'scheduled',
        priority: 'critical',
        description: 'Austausch der Elektrischen Anlage nach 10 Jahren',
        estimatedDuration: 4,
        cost: 3000
      }
    ];
    
    // Filter by property if specified
    const filteredEvents = propertyId 
      ? mockEvents.filter(event => event.propertyId === propertyId)
      : mockEvents;
    
    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length,
      scheduled: filteredEvents.filter(e => e.status === 'scheduled').length,
      overdue: filteredEvents.filter(e => e.status === 'overdue').length,
      completed: filteredEvents.filter(e => e.status === 'completed').length,
      critical: filteredEvents.filter(e => e.priority === 'critical').length
    });
    
  } catch (error) {
    console.error('Maintenance calendar API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch maintenance calendar',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function getEstimatedCost(componentType: string, priority: string): number {
  const baseCosts: Record<string, number> = {
    'heating': 200,
    'electrical': 150,
    'plumbing': 120,
    'security': 100,
    'fire_safety': 300,
    'elevator': 500,
    'roof': 400,
    'facade': 300,
    'basement': 100,
    'garden': 80,
    'parking': 60,
    'other': 100
  };
  
  const priorityMultipliers: Record<string, number> = {
    'low': 1,
    'medium': 1.2,
    'high': 1.5,
    'critical': 2
  };
  
  const baseCost = baseCosts[componentType] || 100;
  const multiplier = priorityMultipliers[priority] || 1;
  
  return Math.round(baseCost * multiplier);
}

function getReplacementCost(componentType: string): number {
  const replacementCosts: Record<string, number> = {
    'heating': 5000,
    'electrical': 3000,
    'plumbing': 2000,
    'security': 1500,
    'fire_safety': 4000,
    'elevator': 15000,
    'roof': 8000,
    'facade': 6000,
    'basement': 2000,
    'garden': 1000,
    'parking': 800,
    'other': 1500
  };
  
  return replacementCosts[componentType] || 2000;
}
