'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeletePropertyButton from '@/components/DeletePropertyButton';

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [params.id]);

  const loadProperty = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

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

  const propertyTypes: any = {
    house: '🏡 Einfamilienhaus',
    apartment: '🏢 Wohnung',
    multi_family: '🏘️ Mehrfamilienhaus',
    commercial: '🏭 Gewerbeobjekt',
  };

  return (
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
                href={`/properties/${property.id}/edit`}
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
          {property.status && (
            <div className={`px-6 py-3 ${
              property.status === 'rented' 
                ? 'bg-green-50 border-b border-green-200' 
                : 'bg-yellow-50 border-b border-yellow-200'
            }`}>
              <p className={`text-sm font-medium ${
                property.status === 'rented' ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {property.status === 'rented' ? '✅ Vermietet' : '⏳ Verfügbar'}
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
                  href={`/properties/${property.id}/maintenance/new`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                >
                  + Hinzufügen
                </Link>
              </h2>

              {components.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">Noch keine Wartungen angelegt</p>
                  <Link
                    href={`/properties/${property.id}/maintenance/new`}
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    🔧 Erste Wartung hinzufügen
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {components.map((component: any) => {
                    const status = getMaintenanceStatus(component.last_maintenance, component.next_maintenance);

                    // Component display name mapping
                    const componentNames: any = {
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
                                Letzte: <strong>{new Date(component.last_maintenance).toLocaleDateString('de-AT')}</strong>
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
                                Nächste: <strong>{new Date(component.next_maintenance).toLocaleDateString('de-AT')}</strong>
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
    </div>
  );
}