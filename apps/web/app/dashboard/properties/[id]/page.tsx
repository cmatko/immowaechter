'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeletePropertyButton from '@/components/DeletePropertyButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RiskBadge } from '@/components/RiskBadge';
import { RiskDetailsModal } from '@/components/RiskDetailsModal';
import type { Property, Component, PropertyType, ComponentRisk } from '@/types/database';

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Risk System State
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [riskData, setRiskData] = useState<any>(null);
  const [riskLoading, setRiskLoading] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [params.id]);

  // Risk System Functions
  const showRiskDetails = async (componentId: string) => {
    setRiskLoading(true);
    try {
      const response = await fetch(`/api/components/${componentId}/risk`);
      const data = await response.json();
      
      if (data.success) {
        setRiskData(data.data);
        setRiskModalOpen(true);
      } else {
        console.error('Risk API Error:', data.error);
        alert('Fehler beim Laden der Risiko-Details: ' + data.error);
      }
    } catch (error) {
      console.error('Risk API Error:', error);
      alert('Fehler beim Laden der Risiko-Details');
    } finally {
      setRiskLoading(false);
    }
  };

  const loadProperty = async () => {
    // Authentication wird vom Dashboard Layout gehandhabt
    // Hier keine zusätzliche Prüfung, um doppelte Redirects zu vermeiden

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      setError('Immobilie nicht gefunden');
      setLoading(false);
      return;
    }

    if (data.user_id !== session.user.id) {
      setError('Keine Berechtigung');
      setLoading(false);
      return;
    }

    setProperty(data);

    // Load components WITHOUT maintenance_intervals join
    const { data: componentsData, error: compError } = await supabase
      .from('components')
      .select('*')
      .eq('property_id', params.id)
      .eq('is_active', true)
      .order('next_maintenance', { ascending: true });

    setComponents(componentsData || []);
    setLoading(false);
  };

  const handleMarkAsDone = async (componentId: string) => {
    // Get the component to find its interval
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Calculate next maintenance based on interval_id type
    const intervalMonths = component.interval_id === 'HEAT_GAS_001' ? 12 : 12; // Default 12 months
    const next = new Date();
    next.setMonth(next.getMonth() + intervalMonths);
    const nextMaintenance = next.toISOString().split('T')[0];

    const { error } = await supabase
      .from('components')
      .update({
        last_maintenance: today,
        next_maintenance: nextMaintenance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', componentId);

    if (error) {
      alert('Fehler: ' + error.message);
      return;
    }

    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    loadProperty();
  };

  const getMaintenanceStatus = (lastMaintenance: string, nextMaintenance: string) => {
    const today = new Date();
    const last = new Date(lastMaintenance);
    const next = new Date(nextMaintenance);
    const daysUntil = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceLast = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    // If maintenance was done today, mark as "just completed"
    const isJustCompleted = daysSinceLast === 0;

    if (isJustCompleted) {
      return { 
        color: 'green', 
        text: 'Gerade erledigt', 
        days: daysUntil, 
        status: 'completed', 
        justDone: true,
        isOverdue: false 
      };
    } else if (daysUntil < 0) {
      return { 
        color: 'red', 
        text: 'Überfällig', 
        days: Math.abs(daysUntil), 
        status: 'overdue', 
        justDone: false,
        isOverdue: true 
      };
    } else if (daysUntil <= 30) {
      return { 
        color: 'yellow', 
        text: 'Bald fällig', 
        days: daysUntil, 
        status: 'soon', 
        justDone: false,
        isOverdue: false 
      };
    } else {
      return { 
        color: 'green', 
        text: 'OK', 
        days: daysUntil, 
        status: 'ok', 
        justDone: false,
        isOverdue: false 
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fehler</h1>
          <p className="text-gray-600 mb-4">{error || 'Immobilie nicht gefunden'}</p>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const propertyTypes: Record<PropertyType, string> = {
    house: '🏡 Einfamilienhaus',
    apartment: '🏢 Wohnung',
    multi_family: '🏘️ Mehrfamilienhaus',
    commercial: '🏭 Gewerbeobjekt',
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Property Details Error Boundary caught error:', error, errorInfo);
        // Could send specific property errors to analytics
      }}
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Immobilien-Details Fehler</h2>
            <p className="text-gray-600 mb-6">Die Immobilien-Details konnten nicht geladen werden. Bitte versuchen Sie es erneut.</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Seite neu laden
              </button>
              <Link
                href="/dashboard"
                className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block"
              >
                ← Zurück zum Dashboard
              </Link>
            </div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 py-8">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          ✅ Wartung erfolgreich aktualisiert!
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 inline-block">
            ← Zurück zum Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <p className="text-gray-600">
                Erstellt am {new Date(property.created_at).toLocaleDateString('de-AT')}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/dashboard/properties/${property.id}/edit`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                ✏️ Bearbeiten
              </Link>
              <DeletePropertyButton 
                propertyId={property.id} 
                propertyName={property.name} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {(property as any).status && (
            <div className={`px-6 py-3 ${
              (property as any).status === 'rented' 
                ? 'bg-green-50 border-b border-green-200' 
                : 'bg-yellow-50 border-b border-yellow-200'
            }`}>
              <p className={`text-sm font-medium ${
                (property as any).status === 'rented' ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {(property as any).status === 'rented' ? '✅ Vermietet' : '⏳ Verfügbar'}
              </p>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresse
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-900">{property.address}</p>
                <p className="text-gray-600">{property.postal_code} {property.city}</p>
                <p className="text-gray-600">{property.country}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Immobilientyp</p>
                  <p className="text-lg font-medium text-gray-900">
                    {propertyTypes[property.property_type] || property.property_type}
                  </p>
                </div>
                {property.build_year && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Baujahr</p>
                    <p className="text-lg font-medium text-gray-900">{property.build_year}</p>
                  </div>
                )}
                {property.living_area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Wohnfläche</p>
                    <p className="text-lg font-medium text-gray-900">{property.living_area} m²</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Letzte Aktualisierung</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(property.updated_at).toLocaleDateString('de-AT')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Wartungen ({components.length})
                </span>
                <Link
                  href={`/dashboard/properties/${property.id}/maintenance/new`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                >
                  + Hinzufügen
                </Link>
              </h2>

              {components.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">Noch keine Wartungen angelegt</p>
                  <Link
                    href={`/dashboard/properties/${property.id}/maintenance/new`}
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    🔧 Erste Wartung hinzufügen
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {components.map((component: Component) => {
                    const status = getMaintenanceStatus(
                      (component as any).last_maintenance || '',
                      (component as any).next_maintenance || ''
                    );

                    // Component display name mapping
                    const componentNames: Record<string, string> = {
                      'HEAT_GAS_001': 'Gastherme',
                      'HEAT_OIL_001': 'Ölheizung',
                      'HEAT_PELLET_001': 'Pelletsheizung',
                    };

                    return (
                      <div
                        key={component.id}
                        className={`border-l-4 rounded-lg p-4 ${
                          status.justDone
                            ? 'bg-green-50 border-green-500'
                            : status.status === 'overdue'
                            ? 'bg-red-50 border-red-500'
                            : status.status === 'soon'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-green-50 border-green-500'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {component.custom_name || componentNames[component.interval_id] || 'Wartung'}
                              </h3>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                                ⚖️ Gesetzlich
                              </span>
                              {(component as any).risk_level && (
                                <RiskBadge level={(component as any).risk_level} size="sm" />
                              )}
                              {status.justDone && (
                                <span className="text-xs px-2 py-1 bg-green-600 text-white rounded font-medium animate-pulse">
                                  ✓ Heute erledigt!
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Heizung • Regelmäßige Wartung erforderlich
                            </p>
                            {(component.brand || component.model) && (
                              <p className="text-sm text-gray-500 mb-2">
                                {component.brand} {component.model}
                              </p>
                            )}
                            <div className="flex gap-4 text-sm">
                              <span className="text-gray-600">
                                Letzte: <strong>{(component as any).last_maintenance ? new Date((component as any).last_maintenance).toLocaleDateString('de-AT') : 'Nie'}</strong>
                              </span>
                              <span className={`font-medium ${
                                status.justDone
                                  ? 'text-green-700'
                                  : status.status === 'overdue'
                                  ? 'text-red-700'
                                  : status.status === 'soon'
                                  ? 'text-yellow-700'
                                  : 'text-green-700'
                              }`}>
                                Nächste: <strong>{(component as any).next_maintenance ? new Date((component as any).next_maintenance).toLocaleDateString('de-AT') : 'Nicht geplant'}</strong>
                                {status.status === 'overdue' && !status.justDone && (
                                  <span className="ml-2">({status.days} Tage überfällig!)</span>
                                )}
                                {status.status === 'soon' && (
                                  <span className="ml-2">(in {status.days} Tagen)</span>
                                )}
                                {status.status === 'ok' && !status.justDone && (
                                  <span className="ml-2">(in {status.days} Tagen)</span>
                                )}
                                {status.justDone && (
                                  <span className="ml-2">(Nächste in {status.days} Tagen)</span>
                                )}
                              </span>
                            </div>
                            
                            {/* Risk Details Button für kritische Components */}
                            {(component as any).risk_level && ['critical', 'legal'].includes((component as any).risk_level) && (
                              <button
                                onClick={() => showRiskDetails(component.id)}
                                disabled={riskLoading}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {riskLoading ? '⏳ Lädt...' : '⚠️ Risiko-Details anzeigen'}
                              </button>
                            )}
                          </div>
                          <div className="ml-4">
                            {/* Button nur klickbar wenn überfällig oder heute erledigt */}
                            {status.isOverdue || status.justDone ? (
                              status.justDone ? (
                                <button
                                  disabled
                                  className="px-3 py-1 rounded font-medium text-sm bg-green-600 text-white cursor-not-allowed opacity-75"
                                >
                                  ✓ Erledigt
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleMarkAsDone(component.id)}
                                  className="px-3 py-1 rounded font-medium text-sm bg-red-600 hover:bg-red-700 text-white"
                                >
                                  ✓ Erledigt
                                </button>
                              )
                            ) : (
                              <button
                                disabled
                                className="px-3 py-1 rounded font-medium text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
                              >
                                ✓ Aktuell
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk Details Modal */}
      {riskModalOpen && riskData && (
        <RiskDetailsModal
          isOpen={riskModalOpen}
          onClose={() => setRiskModalOpen(false)}
          componentName={riskData.component.name || 'Unbekanntes Component'}
          risk={riskData.risk}
        />
      )}
    </div>
    </ErrorBoundary>
  );
}
