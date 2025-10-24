/**
 * Authentication Setup für E2E Tests
 * Simuliert einen eingeloggten Benutzer für alle Tests
 */

import { test as base, expect } from '@playwright/test';

// Erweiterte Test-Funktion mit Authentication
export const test = base.extend({
  // Automatische Authentifizierung vor jedem Test
  page: async ({ page }, use) => {
    // Mock Session für Tests
    await page.addInitScript(() => {
      // Simuliere eine gültige Session
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + (5 * 60 * 1000), // 5 Minuten
        user: {
          id: 'test-user-id',
          email: 'test@immowaechter.com'
        }
      };
      
      // Setze Session in localStorage
      window.localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
      
      // Setze auch in sessionStorage als Fallback
      window.sessionStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
      
      console.log('🔐 Mock session set:', mockSession);
    });

    await use(page);
  },
});

export { expect };
