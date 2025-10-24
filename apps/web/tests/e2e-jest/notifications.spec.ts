/**
 * End-to-End Tests für das Notification Center
 * Testet die Benachrichtigungslogik und API
 */

import { test, expect } from '@playwright/test';

test.describe('Notification Center E2E Tests', () => {
  
  test('Notification API returns correct data structure', async ({ page }) => {
    // Teste die Notifications API direkt
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(4);
    
    // Überprüfe die Struktur der Benachrichtigungen
    expect(data.data[0].type).toBe('critical');
    expect(data.data[0].title).toBe('Wartung überfällig');
    expect(data.data[1].type).toBe('warning');
    expect(data.data[1].title).toBe('Wartung fällig');
    expect(data.data[2].type).toBe('info');
    expect(data.data[2].title).toBe('Neue Inspektion geplant');
    expect(data.data[3].type).toBe('success');
    expect(data.data[3].title).toBe('Wartung abgeschlossen');
  });

  test('Unread count logic is correct (3 unread, 1 read)', async ({ page }) => {
    // Teste, dass die Zahl 3 korrekt die ungelesenen Benachrichtigungen widerspiegelt
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    // Zähle die ungelesenen Benachrichtigungen (alle außer der letzten)
    const unreadCount = data.data.filter((notification: any) => 
      notification.type !== 'success' // Erfolgreiche Nachrichten sind "gelesen"
    ).length;
    
    expect(unreadCount).toBe(3);
    expect(data.data).toHaveLength(4);
    
    // Überprüfe die einzelnen Benachrichtigungstypen
    const criticalCount = data.data.filter((n: any) => n.type === 'critical').length;
    const warningCount = data.data.filter((n: any) => n.type === 'warning').length;
    const infoCount = data.data.filter((n: any) => n.type === 'info').length;
    const successCount = data.data.filter((n: any) => n.type === 'success').length;
    
    expect(criticalCount).toBe(1); // 1 kritische (ungelesen)
    expect(warningCount).toBe(1); // 1 Warnung (ungelesen)
    expect(infoCount).toBe(1); // 1 Info (ungelesen)
    expect(successCount).toBe(1); // 1 Erfolg (gelesen)
  });

  test('Notification content matches expected messages', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    // Überprüfe die spezifischen Nachrichten
    expect(data.data[0].message).toContain('Elektrische Anlage');
    expect(data.data[0].message).toContain('45 Tagen überfällig');
    
    expect(data.data[1].message).toContain('Heizungsanlage');
    expect(data.data[1].message).toContain('3 Tagen');
    
    expect(data.data[2].message).toContain('Brandschutzanlage');
    expect(data.data[2].message).toContain('2 Wochen');
    
    expect(data.data[3].message).toContain('Wasserversorgung');
    expect(data.data[3].message).toContain('erfolgreich gewartet');
  });

  test('Notification timestamps are correct', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    // Überprüfe, dass alle Benachrichtigungen Timestamps haben
    data.data.forEach((notification: any) => {
      expect(notification.created_at).toBeDefined();
      expect(notification.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  test('Notification read status is correct', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    // Überprüfe den gelesenen Status
    expect(data.data[0].read).toBe(false); // Kritisch - ungelesen
    expect(data.data[1].read).toBe(false); // Warnung - ungelesen
    expect(data.data[2].read).toBe(false); // Info - ungelesen
    expect(data.data[3].read).toBe(true); // Erfolg - gelesen
  });

  test('Notification count calculation is correct', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    // Berechne die ungelesenen Benachrichtigungen
    const unreadNotifications = data.data.filter((notification: any) => 
      notification.read === false
    );
    
    expect(unreadNotifications.length).toBe(3);
    
    // Überprüfe, dass die Logik korrekt ist
    const totalNotifications = data.data.length;
    const readNotifications = data.data.filter((notification: any) => 
      notification.read === true
    );
    
    expect(totalNotifications).toBe(4);
    expect(readNotifications.length).toBe(1);
    expect(unreadNotifications.length).toBe(3);
  });
});
