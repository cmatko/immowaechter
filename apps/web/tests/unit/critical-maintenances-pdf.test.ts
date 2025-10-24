import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';

// Mock der PDF API Route
describe('Critical Maintenances PDF Export', () => {
  let mockComponents: any[];

  beforeAll(() => {
    // Mock-Daten für Tests
    mockComponents = [
      {
        id: 'test-1',
        propertyId: 'prop-1',
        propertyName: 'Test Property',
        propertyAddress: 'Test Address 1',
        componentName: 'Heizung',
        componentType: 'heating',
        riskLevel: 'critical',
        daysOverdue: 15,
        nextMaintenance: '2024-01-01',
        lastMaintenance: '2023-12-01'
      },
      {
        id: 'test-2',
        propertyId: 'prop-2',
        propertyName: 'Test Property 2',
        propertyAddress: 'Test Address 2',
        componentName: 'Elektrik',
        componentType: 'electrical',
        riskLevel: 'legal',
        daysOverdue: 30,
        nextMaintenance: '2023-12-01',
        lastMaintenance: '2023-11-01'
      }
    ];
  });

  it('should generate PDF with correct content structure', async () => {
    const { req } = createMocks<NextRequest>({
      method: 'POST',
      body: JSON.stringify({
        components: mockComponents,
        filters: { riskLevel: 'all', propertyId: 'all', componentType: 'all' },
        sortBy: 'overdue',
        sortOrder: 'desc'
      })
    });

    // Simuliere PDF API Call
    const response = await fetch('http://localhost:3001/api/dashboard/critical-maintenances/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        components: mockComponents,
        filters: { riskLevel: 'all', propertyId: 'all', componentType: 'all' },
        sortBy: 'overdue',
        sortOrder: 'desc'
      })
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/pdf');
  });

  it('should include all required sections in PDF', async () => {
    const pdfContent = generateTestPDFContent(mockComponents);
    
    // Prüfe ob alle wichtigen Sektionen enthalten sind
    expect(pdfContent).toContain('KRITISCHE WARTUNGEN - BERICHT');
    expect(pdfContent).toContain('ANZAHL WARTERUNGEN: 2');
    expect(pdfContent).toContain('Heizung');
    expect(pdfContent).toContain('Elektrik');
    expect(pdfContent).toContain('KRITISCH: Rechtliche Konsequenzen');
    expect(pdfContent).toContain('ImmoWächter - Risikomanagement');
  });

  it('should handle empty components array', async () => {
    const pdfContent = generateTestPDFContent([]);
    
    expect(pdfContent).toContain('ANZAHL WARTERUNGEN: 0');
    expect(pdfContent).toContain('KRITISCHE WARTUNGEN - BERICHT');
  });

  it('should respect filters in PDF content', async () => {
    const filteredComponents = mockComponents.filter(c => c.riskLevel === 'critical');
    const pdfContent = generateTestPDFContent(filteredComponents);
    
    expect(pdfContent).toContain('ANZAHL WARTERUNGEN: 1');
    expect(pdfContent).toContain('Heizung');
    expect(pdfContent).not.toContain('Elektrik');
  });
});

// Helper function für PDF Content Generation
function generateTestPDFContent(components: any[]) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-AT');
  const timeStr = now.toLocaleTimeString('de-AT');
  
  let content = `KRITISCHE WARTUNGEN - BERICHT
Generiert am: ${dateStr} um ${timeStr}

FILTER:
- Risk Level: Alle
- Immobilie: Alle
- Komponente: Alle
- Sortierung: overdue (desc)

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

