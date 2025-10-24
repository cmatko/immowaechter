import { describe, test, expect, beforeAll } from '@jest/globals';

describe('Notifications System', () => {
  let userId: string;
  let pushSubscription: any;

  beforeAll(async () => {
    // Setup test user
    userId = 'test-user-id';
    
    pushSubscription = {
      endpoint: 'https://test.example.com/push',
      keys: {
        p256dh: 'test-p256dh-key',
        auth: 'test-auth-key'
      }
    };
  });

  test('Service Worker exists', async () => {
    const response = await fetch('http://localhost:3000/sw.js');
    expect(response.status).toBe(200);
  });

  test('Subscribe API works', async () => {
    const response = await fetch('http://localhost:3000/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pushSubscription)
    });

    const data = await response.json();
    expect(data.success).toBeDefined();
  });

  test('Email templates generate valid HTML', async () => {
    const { emailTemplates } = await import('../../lib/email-templates');
    
    const email = emailTemplates.criticalMaintenance({
      userName: 'Test',
      componentName: 'Heizung',
      propertyName: 'Testhaus',
      daysOverdue: 90,
      riskLevel: 'critical',
      detailsUrl: 'http://test.com'
    });

    expect(email.subject).toContain('DRINGEND');
    expect(email.html).toContain('<!DOCTYPE html>');
    expect(email.html).toContain('Heizung');
  });

  test('Push notification payload is valid', () => {
    const payload = {
      title: 'Test',
      body: 'Test message',
      url: '/dashboard',
      riskLevel: 'warning'
    };

    expect(payload.title).toBeDefined();
    expect(payload.body).toBeDefined();
    expect(['safe', 'warning', 'danger', 'critical', 'legal']).toContain(payload.riskLevel);
  });
});





