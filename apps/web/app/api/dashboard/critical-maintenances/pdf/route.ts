import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { components, filters, sortBy, sortOrder } = await request.json();
    
    // Generate PDF content
    const pdfContent = generatePDFContent(components, filters, sortBy, sortOrder);
    
    // For now, return a simple text response
    // In production, you'd use a PDF library like puppeteer or jsPDF
    const response = new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="kritische-wartungen-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generatePDFContent(components: any[], filters: any, sortBy: string, sortOrder: string) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-AT');
  const timeStr = now.toLocaleTimeString('de-AT');
  
  let content = `KRITISCHE WARTUNGEN - BERICHT
Generiert am: ${dateStr} um ${timeStr}

FILTER:
- Risk Level: ${filters.riskLevel === 'all' ? 'Alle' : filters.riskLevel}
- Immobilie: ${filters.propertyId === 'all' ? 'Alle' : 'Spezifisch'}
- Komponente: ${filters.componentType === 'all' ? 'Alle' : filters.componentType}
- Sortierung: ${sortBy} (${sortOrder})

ANZAHL WARTERUNGEN: ${components.length}

`;

  components.forEach((comp, index) => {
    content += `${index + 1}. ${comp.componentName}
   Immobilie: ${comp.propertyName}
   Adresse: ${comp.propertyAddress}
   Typ: ${comp.componentType}
   Risk Level: ${comp.riskLevel}
   Tage überfällig: ${comp.daysOverdue}
   Fällig seit: ${comp.nextMaintenance ? new Date(comp.nextMaintenance).toLocaleDateString('de-AT') : 'Unbekannt'}
   
   WARNUNG: ${comp.riskLevel === 'legal' ? 'KRITISCH: Rechtliche Konsequenzen nach ABGB/StGB möglich!' : 
             comp.riskLevel === 'critical' ? 'GEFAHR: Versicherungsschutz gefährdet nach österreichischem Recht!' :
             'WARNUNG: Bitte schnellstmöglich durchführen!'}

`;
  });

  content += `
HINWEISE:
- Dieser Bericht wurde automatisch generiert
- Für rechtliche Beratung wenden Sie sich an einen Fachanwalt
- Versicherungsschutz kann bei überfälligen Wartungen gefährdet sein
- Dokumentieren Sie alle durchgeführten Wartungen

ImmoWächter - Risikomanagement für Immobilien
https://immowaechter.at
`;

  return content;
}

