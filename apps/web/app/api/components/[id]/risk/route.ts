import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role key for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Risk API called for component:', params.id);
    
    // 1. Get Component
    console.log('Looking for component with ID:', params.id);
    
    const { data: components, error: componentError } = await supabase
      .from('components')
      .select('*')
      .eq('id', params.id);
    
    const component = components?.[0];
    
    console.log('Component query result:', { component, error: componentError });
    
    if (componentError) {
      console.log('Component query error:', componentError);
      return NextResponse.json(
        { 
          success: false,
          error: `Component query failed: ${componentError.message}`,
          data: null
        },
        { status: 404 }
      );
    }
    
    if (!component) {
      console.log('Component not found in database');
      return NextResponse.json(
        { 
          success: false,
          error: 'Component not found in database',
          data: null
        },
        { status: 404 }
      );
    }
    
    console.log('Component found:', component.custom_name);
    
    // 2. Determine component type and name
    const componentType = 'Gasheizung'; // For now, hardcoded - later use mapping
    const componentName = component.custom_name || componentType || 'Wartung';
    
    // 3. Get Risk Consequences
    // TODO: When adding DE support, filter by user.country:
    // .eq('country', user.country)
    // .or('country.eq.BOTH')
    // Aktuell: Alle Queries holen nur AT Content (ist default)
    const { data: consequences } = await supabase
      .from('risk_consequences')
      .select('*')
      .eq('component_type', componentType)
      .eq('country', 'AT') // Österreich-First Approach
      .single();
    
    // 4. Build response
    const riskLevel = (component as any).risk_level || 'safe';
    
    const response = {
      success: true,
      data: {
        component: {
          id: component.id,
          name: componentName,
          type: componentType,
          nextMaintenance: component.next_maintenance,
          daysOverdue: (component as any).days_overdue || 0
        },
        risk: {
          level: riskLevel,
          emoji: riskLevel === 'safe' ? '🟢' : riskLevel === 'warning' ? '🟡' : riskLevel === 'danger' ? '🟠' : riskLevel === 'critical' ? '🔴' : '⚫',
          color: riskLevel === 'safe' ? 'green' : riskLevel === 'warning' ? 'yellow' : riskLevel === 'danger' ? 'orange' : riskLevel === 'critical' ? 'red' : 'black',
          message: consequences?.warning_yellow || 'Wartung aktuell',
          consequences: {
            death: consequences?.death_risk || false,
            injury: consequences?.injury_risk || false,
            insurance: consequences?.insurance_void || false,
            criminal: consequences?.criminal_liability || false,
            damage: {
              min: consequences?.damage_cost_min || 0,
              max: consequences?.damage_cost_max || 0
            }
          },
          realCase: consequences?.real_case || undefined,
          statistic: consequences?.statistic || undefined
        }
      }
    };
    
    console.log('Risk API response:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Risk API Error:', error);
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