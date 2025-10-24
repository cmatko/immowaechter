'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { RiskBadge } from '@/components/RiskBadge';
import { ArrowLeft, AlertTriangle, Download } from 'lucide-react';
import Link from 'next/link';
import type { RiskLevel } from '@/types/database';
import { isValidComponentType } from '@/lib/component-types';

interface CriticalComponent {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  componentName: string;
  componentType: string;
  riskLevel: RiskLevel;
  daysOverdue: number;
  nextMaintenance: string | null;
  lastMaintenance: string | null;
}

export default function CriticalMaintenancesPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  
  const [components, setComponents] = useState<CriticalComponent[]>([]);
  
  // Filter & Sort State
  const [filters, setFilters] = useState({
    riskLevel: 'all', // 'all' | 'critical' | 'legal'
    propertyId: 'all', // 'all' | specific property ID
    componentType: 'all' // 'all' | 'heating' | 'electrical' | etc.
  });

  const [sortBy, setSortBy] = useState<'overdue' | 'property' | 'component' | 'risk'>('overdue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // KEIN AUTH CHECK - Dashboard Layout macht bereits Auth Check
  // Hier nur Daten laden

  // Mock-Daten für Tests
  const mockComponents: CriticalComponent[] = [
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

  // Filter & Sort Logic - MIT SAFETY CHECK
  const filteredComponents = (components || []).filter(component => {
    // Risk Level Filter
    if (filters.riskLevel !== 'all' && component.riskLevel !== filters.riskLevel) {
      return false;
    }

    // Property Filter
    if (filters.propertyId !== 'all' && component.propertyId !== filters.propertyId) {
      return false;
    }

    // Component Type Filter
    if (filters.componentType !== 'all' && component.componentType !== filters.componentType) {
      return false;
    }

    return true;
  });

  // Sort Logic - MIT SAFETY CHECK
  const sortedComponents = [...(filteredComponents || [])].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'overdue':
        comparison = (b.daysOverdue || 0) - (a.daysOverdue || 0);
        break;
      case 'property':
        comparison = (a.propertyName || '').localeCompare(b.propertyName || '');
        break;
      case 'component':
        comparison = (a.componentType || '').localeCompare(b.componentType || '');
        break;
      case 'risk':
        const riskOrder: Record<string, number> = { legal: 2, critical: 1 };
        comparison = (riskOrder[b.riskLevel] || 0) - (riskOrder[a.riskLevel] || 0);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });

  useEffect(() => {
    // Lade Components von API
    async function fetchCriticalComponents() {
      try {
        console.log('📊 Fetching critical components from API...');
        const response = await fetch('/api/dashboard/critical-maintenances');
        const data = await response.json();
        
        console.log('📊 API Response:', data);
        
        if (data.success && data.data) {
          console.log(`📊 API returned ${data.data.length} components`);
          setComponents(data.data);
        } else {
          console.error('❌ API error:', data.error);
          // Fallback zu Mock-Daten
          console.log('📊 Using mock data as fallback');
          setComponents(mockComponents);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
        // Fallback zu Mock-Daten
        console.log('📊 Using mock data as fallback');
        setComponents(mockComponents);
      }
    }

    fetchCriticalComponents();
  }, []);

  // PDF Export Function
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/dashboard/critical-maintenances/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components: sortedComponents,
          filters,
          sortBy,
          sortOrder
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kritische-wartungen-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Fehler beim Generieren des PDFs. Bitte versuchen Sie es erneut.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  // KEIN AUTH CHECK - Page lädt sofort

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -8px, 0); }
          70% { transform: translate3d(0, -4px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              ⚠️ Kritische Wartungen
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="text-left sm:text-right">
                <div className="text-sm text-gray-600">
                  {sortedComponents.length} von {components.length} Wartungen
                </div>
                {sortedComponents.length !== components.length && (
                  <div className="text-xs text-purple-600">
                    (gefiltert)
                  </div>
                )}
              </div>
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF || sortedComponents.length === 0}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm sm:text-base touch-manipulation"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? 'Generiere PDF...' : 'PDF Export'}
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Wartungen mit hohem Risiko - sofortiges Handeln erforderlich
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Risk Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🚨 Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
              >
                <option value="all">Alle anzeigen</option>
                <option value="critical">⚫ Kritisch</option>
                <option value="legal">⚖️ Rechtlich</option>
              </select>
            </div>

            {/* Property Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏠 Immobilie
              </label>
              <select
                value={filters.propertyId}
                onChange={(e) => setFilters({ ...filters, propertyId: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
              >
                <option value="all">Alle Immobilien</option>
                {components && Array.from(new Set(components.map(c => c.propertyId))).map(propId => {
                  const component = components.find(c => c.propertyId === propId);
                  return component ? (
                    <option key={propId} value={propId}>
                      {component.propertyName || 'Unbekannt'}
                    </option>
                  ) : null;
                })}
              </select>
            </div>

            {/* Component Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔧 Komponente
              </label>
              <select
                value={filters.componentType}
                onChange={(e) => setFilters({ ...filters, componentType: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
              >
                <option value="all">Alle Komponenten</option>
                {components && Array.from(new Set(components.map(c => c.componentType))).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Sortierung
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
              >
                <option value="overdue">Tage überfällig</option>
                <option value="property">Immobilie (A-Z)</option>
                <option value="component">Komponente (A-Z)</option>
                <option value="risk">Risk Level</option>
              </select>
            </div>
          </div>

          {/* Sort Order Toggle & Reset */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium touch-manipulation"
            >
              {sortOrder === 'asc' ? '⬆️ Aufsteigend' : '⬇️ Absteigend'}
            </button>

            {/* Active Filters Count */}
            {(filters.riskLevel !== 'all' || filters.propertyId !== 'all' || filters.componentType !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {[
                    filters.riskLevel !== 'all' && 'Risk Level',
                    filters.propertyId !== 'all' && 'Immobilie',
                    filters.componentType !== 'all' && 'Komponente'
                  ].filter(Boolean).length} Filter aktiv
                </span>
                <button
                  onClick={() => setFilters({ riskLevel: 'all', propertyId: 'all', componentType: 'all' })}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium touch-manipulation"
                >
                  Zurücksetzen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Components List */}
        {sortedComponents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-fade-in">
              {components.length === 0 ? 'Keine kritischen Wartungen! 🎉' : 'Keine Wartungen entsprechen den gewählten Filtern.'}
            </h3>
            <p className="text-gray-600 animate-fade-in">
              {components.length === 0 
                ? 'Alle Ihre Wartungen sind aktuell oder nur leicht überfällig.'
                : 'Versuchen Sie andere Filter-Einstellungen oder setzen Sie alle Filter zurück.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {sortedComponents.map((comp, index) => (
              <Link
                key={comp.id}
                href={`/properties/${comp.propertyId}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 p-4 sm:p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  {/* Left Side - Component Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {comp.componentName}
                      </h3>
                      <RiskBadge level={comp.riskLevel} />
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Immobilie:</span> {comp.propertyName}
                      </p>
                      <p>
                        <span className="font-medium">Adresse:</span> {comp.propertyAddress}
                      </p>
                      <p>
                        <span className="font-medium">Typ:</span> {comp.componentType}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Overdue Info */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {comp.daysOverdue}
                    </div>
                    <div className="text-sm text-gray-600">
                      Tage überfällig
                    </div>
                    
                    {comp.nextMaintenance && (
                      <div className="mt-3 text-xs text-gray-500">
                        Fällig seit:{' '}
                        {new Date(comp.nextMaintenance).toLocaleDateString('de-AT')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning Message */}
                <div className={`mt-4 p-3 rounded-lg ${
                  comp.riskLevel === 'legal' ? 'bg-gray-900 text-white' :
                  comp.riskLevel === 'critical' ? 'bg-red-50 text-red-900' :
                  'bg-orange-50 text-orange-900'
                }`}>
                  <p className="text-sm font-medium">
                    {comp.riskLevel === 'legal' && '⚫ KRITISCH: Rechtliche Konsequenzen nach ABGB/StGB möglich!'}
                    {comp.riskLevel === 'critical' && '🔴 GEFAHR: Versicherungsschutz gefährdet nach österreichischem Recht!'}
                    {comp.riskLevel === 'danger' && '🟠 WARNUNG: Bitte schnellstmöglich durchführen!'}
                  </p>
                </div>

                {/* Call to Action */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 text-sm touch-manipulation">
                    Jetzt Handwerker finden
                  </button>
                  <button className="px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 text-sm touch-manipulation">
                    Risiko-Details anzeigen
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
