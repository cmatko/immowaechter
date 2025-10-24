'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

export function useInactivityLogout(timeoutMinutes: number = 1) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Prüfe Auth Status beim Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('❌ Keine Session - Redirect zu Login');
          router.push('/login');
          return;
        }
        
        console.log('✅ Session gefunden - Inactivity Logout aktiviert');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Auth Check Fehler:', error);
        // Bei Fehler (z.B. fehlende Env Vars) zu Login weiterleiten
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const logout = async () => {
    console.log('🔴 AUTO-LOGOUT: 5 Minuten Inaktivität erkannt');
    
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout Fehler:', error);
    }
    
    router.push('/login?reason=inactivity');
  };

  const resetTimeout = () => {
    // Lösche alten Timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    console.log('⏱️ Timer zurückgesetzt - Aktivität erkannt');

    // Starte neuen Timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMinutes * 60 * 1000); // Minuten → Millisekunden
  };

  useEffect(() => {
    // Nur aktivieren wenn User authentifiziert ist
    if (!isAuthenticated) {
      return;
    }

    console.log(`✅ Inactivity Logout aktiviert: ${timeoutMinutes} Minute(n)`);

    // Events die als "Aktivität" zählen
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Bei jeder Aktivität: Timer zurücksetzen
    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Starte initialen Timer
    resetTimeout();

    // Cleanup beim Unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      console.log('🛑 Inactivity Logout deaktiviert');
    };
  }, [timeoutMinutes, isAuthenticated]);
}