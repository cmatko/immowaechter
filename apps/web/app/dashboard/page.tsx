'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import DeletePropertyButton from '@/components/DeletePropertyButton';
import LogoutButton from '@/components/LogoutButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RiskSummaryCard } from '@/components/dashboard/RiskSummaryCard';
import { RiskTrendChart } from '@/components/RiskTrendChart';
import { PropertyRiskScore } from '@/components/PropertyRiskScore';
import { NotificationCenter } from '@/components/NotificationCenter';
import { RiskAlertSystem } from '@/components/RiskAlertSystem';
import { MaintenanceCalendar } from '@/components/MaintenanceCalendar';
import type { Property, User } from '@/types/database';

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      // KEIN AUTH CHECK - Dashboard Layout macht bereits Auth Check
      // Lade nur Properties und User

      // Load current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }

      // Load properties via API (bypasses RLS)
      console.log('🔄 Loading properties via API...');
      try {
        const response = await fetch('/api/properties');
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Properties loaded via API:', result.data?.length || 0, 'properties');
          console.log('📋 Properties data:', result.data);
          setProperties(result.data || []);
        } else {
          console.error('❌ API Error:', result.error);
        }
      } catch (error) {
        console.error('❌ Fetch Error:', error);
        // Fallback to direct Supabase call
        const { data, error: supabaseError } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('❌ Supabase Error:', supabaseError);
        } else {
          console.log('✅ Properties loaded via Supabase:', data?.length || 0, 'properties');
          setProperties(data || []);
        }
      }
      
      // Load notification count
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        if (data.success) {
          const unreadCount = data.data.filter((notif: any) => !notif.read).length;
          setNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    loadData();
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Dashboard Error Boundary caught error:', error, errorInfo);
        // Could send specific dashboard errors to analytics
      }}
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard-Fehler</h2>
            <p className="text-gray-600 mb-6">Das Dashboard konnte nicht geladen werden. Bitte versuchen Sie es erneut.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Meine Immobilien</h1>
            <div className="flex items-center gap-4">
              {/* User Info */}
              {user && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-xs text-gray-500">Angemeldet</div>
                </div>
              )}
              
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L9 15l3 3 6-6" />
                </svg>
                {/* Notification Badge - Dynamic */}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              <a
                href="/dashboard/properties/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neue Immobilie
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Summary Widget */}
        <div className="mb-8">
          <RiskSummaryCard />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Gesamt Immobilien</p>
                <p className="text-2xl font-semibold text-gray-900">{properties?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vermietet</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(properties as any)?.filter((p: any) => p.status === 'rented').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Verfügbar</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(properties as any)?.filter((p: any) => p.status === 'available').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Trend Chart */}
        <div className="mb-8">
          <RiskTrendChart />
        </div>

        {/* Risk Alert System */}
        <div className="mb-8">
          <RiskAlertSystem />
        </div>

        {/* Maintenance Calendar */}
        <div className="mb-8">
          <MaintenanceCalendar />
        </div>

        {/* Properties List - Hauptinhalt */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Meine Immobilien ({properties?.length || 0})</h2>
          </div>
          
          {properties && properties.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {properties.map((property) => (
                <div key={property.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{property.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {property.address}, {property.city} {property.postal_code}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                            {property.property_type === 'house' ? 'Haus' : 'Wohnung'}
                          </span>
                          {property.living_area && (
                            <span className="text-gray-500">
                              {property.living_area} m²
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Baujahr</div>
                        <div className="text-sm font-medium text-gray-900">{property.build_year}</div>
                      </div>
                      
                      <a 
                        href={`/dashboard/properties/${property.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Details ansehen
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Immobilien</h3>
              <p className="mt-1 text-sm text-gray-500">Erstellen Sie Ihre erste Immobilie.</p>
              <div className="mt-6">
                <a
                  href="/dashboard/properties/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Neue Immobilie
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid - Fallback */}
        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (property as any).status === 'rented' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(property as any).status === 'rented' ? 'Vermietet' : 'Verfügbar'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {(property as any).type}
                    </div>
                  </div>
                  
                  {/* Risk Score */}
                  <div className="mt-4">
                    <PropertyRiskScore 
                      propertyId={property.id} 
                      propertyName={property.name} 
                    />
                  </div>
                  
                  {/* Action Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <a 
                      href={`/dashboard/properties/${property.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Details ansehen →
                    </a>
                    <DeletePropertyButton 
                      propertyId={property.id} 
                      propertyName={property.name} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Immobilien</h3>
            <p className="mt-1 text-sm text-gray-500">Legen Sie Ihre erste Immobilie an.</p>
            <div className="mt-6">
              <a
                href="/dashboard/properties/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neue Immobilie
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
    </ErrorBoundary>
  );
}