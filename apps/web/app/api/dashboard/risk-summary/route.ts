import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapComponentTypeToRisk } from '@/lib/risk-helpers';
import type { RiskLevel } from '@/types/database';

// Create Supabase client with service role key for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RiskStats {
  safe: number;
  warning: number;
  danger: number;
  critical: number;
  legal: number;
  total: number;
}

interface CriticalComponent {
  id: string;
  propertyId: string;
  propertyName: string;
  componentName: string;
  riskLevel: RiskLevel;
  daysOverdue: number;
}

export async function GET() {
  try {
    console.log('Risk Summary API called');

    // Mock data based on our 10 Risk Alerts
    const stats: RiskStats = {
      safe: 0,        // 0 sichere Komponenten
      warning: 5,      // 5 Warnungen (Wartung fällig, Alte Wartung)
      danger: 0,      // 0 Gefahren
      critical: 5,    // 5 kritische (Wartung überfällig, Hohes Risiko)
      legal: 0,       // 0 rechtliche
      total: 10       // 10 insgesamt
    };

    const criticalComponents: CriticalComponent[] = [
      {
        id: 'comp-1',
        propertyId: 'prop-1',
        propertyName: 'Wohnung Wien-Innere Stadt',
        componentName: 'Elektrische Anlage',
        riskLevel: 'critical',
        daysOverdue: 45
      },
      {
        id: 'comp-3',
        propertyId: 'prop-3',
        propertyName: 'Bürogebäude Graz',
        componentName: 'Brandschutzanlage',
        riskLevel: 'critical',
        daysOverdue: 0
      },
      {
        id: 'comp-5',
        propertyId: 'prop-5',
        propertyName: 'Bürogebäude Graz',
        componentName: 'Aufzug',
        riskLevel: 'critical',
        daysOverdue: 15
      },
      {
        id: 'comp-7',
        propertyId: 'prop-7',
        propertyName: 'Loft Wien-Leopoldstadt',
        componentName: 'Gasleitung',
        riskLevel: 'critical',
        daysOverdue: 0
      },
      {
        id: 'comp-9',
        propertyId: 'prop-9',
        propertyName: 'Villa Vorarlberg',
        componentName: 'Solaranlage',
        riskLevel: 'critical',
        daysOverdue: 30
      }
    ];

    console.log('Risk stats calculated:', stats);
    console.log(`Found ${criticalComponents.length} critical components`);

    const response = {
      success: true,
      data: {
        stats,
        criticalComponents
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Risk Summary API Error:', error);
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
