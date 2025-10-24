'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';

export function NotificationSettings() {
  const { permission, isSupported, requestPermission, unsubscribe } = usePushNotifications();
  const [emailEnabled, setEmailEnabled] = useState(true);

  async function handlePushToggle() {
    if (permission === 'granted') {
      await unsubscribe();
    } else {
      await requestPermission();
    }
  }

  async function handleEmailToggle() {
    // Update user preferences in database
    await fetch('/api/user/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailNotifications: !emailEnabled })
    });
    setEmailEnabled(!emailEnabled);
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Benachrichtigungen</h2>

      {/* Push Notifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {permission === 'granted' ? (
              <Bell className="w-5 h-5 text-blue-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <h3 className="font-bold">Push-Benachrichtigungen</h3>
              <p className="text-sm text-gray-600">
                Browser-Benachrichtigungen für kritische Wartungen
              </p>
              {!isSupported && (
                <p className="text-xs text-red-600 mt-1">
                  Ihr Browser unterstützt keine Push-Benachrichtigungen
                </p>
              )}
            </div>
          </div>
          
          {isSupported && (
            <button
              onClick={handlePushToggle}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                permission === 'granted'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {permission === 'granted' ? 'Aktiviert' : 'Aktivieren'}
            </button>
          )}
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className={`w-5 h-5 ${emailEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <h3 className="font-bold">Email-Benachrichtigungen</h3>
              <p className="text-sm text-gray-600">
                Wöchentliche Zusammenfassung und kritische Wartungen
              </p>
            </div>
          </div>
          
          <button
            onClick={handleEmailToggle}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              emailEnabled
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {emailEnabled ? 'Aktiviert' : 'Aktivieren'}
          </button>
        </div>

        {/* WhatsApp - Coming Soon */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="font-bold text-gray-600">WhatsApp-Benachrichtigungen</h3>
              <p className="text-sm text-gray-500">
                Bald verfügbar im Premium-Plan
              </p>
            </div>
          </div>
          
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
            Bald verfügbar
          </span>
        </div>
      </div>

      {/* Frequency Settings */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-bold mb-3">Benachrichtigungs-Frequenz</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Sofort bei kritischen Wartungen</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Wöchentliche Zusammenfassung</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">3 Monate vor Fälligkeit</span>
          </label>
        </div>
      </div>
    </div>
  );
}





