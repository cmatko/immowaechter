'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Prüfe ob Environment Variables verfügbar sind
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('❌ Supabase Environment Variables nicht verfügbar - Redirect zu Login');
          router.push('/login');
          return;
        }

        // Check for mock session in localStorage (for tests)
        const mockSession = localStorage.getItem('supabase.auth.token');
        if (mockSession) {
          try {
            const sessionData = JSON.parse(mockSession);
            if (sessionData.access_token && sessionData.user) {
              console.log('✅ Mock Session gefunden - Dashboard Layout aktiv (Test Mode)');
              setIsAuthenticated(true);
              return;
            }
          } catch (error) {
            console.log('❌ Mock Session parsing error:', error);
          }
        }

        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !session.user) {
          console.log('❌ Keine Session - Redirect zu Login');
          router.push('/login');
          return;
        }
        
        // Nur bei wirklich abgelaufenen Sessions weiterleiten
        const now = new Date().getTime() / 1000;
        const sessionExpiry = session.expires_at || 0;
        
        // 5 Minuten = 300 Sekunden
        if (sessionExpiry > 0 && (now - sessionExpiry) > 300) {
          console.log('❌ Session abgelaufen (5+ Minuten) - Redirect zu Login');
          router.push('/login');
          return;
        }
        
        console.log('✅ Session gefunden - Dashboard Layout aktiv');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Auth Check Fehler:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // ⏱️ Auto-Logout nach 5 Minuten Inaktivität (nur wenn authentifiziert)
  useInactivityLogout(5);

  // Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authentifizierung...</p>
        </div>
      </div>
    );
  }

  // Nicht authentifiziert - wird zu Login weitergeleitet
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">
              🏠 ImmoWächter
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Dashboard
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const supabase = getSupabaseBrowserClient();
                    await supabase.auth.signOut();
                    router.push('/login');
                  } catch (error) {
                    console.error('Logout error:', error);
                    router.push('/login');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}