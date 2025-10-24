'use client';

import { useState, useEffect } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function requestPermission() {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);

    if (permission === 'granted') {
      await subscribeToPush();
    }

    return permission === 'granted';
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID Public Key (generieren mit: npx web-push generate-vapid-keys)
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      setSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async function unsubscribe() {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remove from backend
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
    }
  }

  return {
    permission,
    subscription,
    isSupported: 'Notification' in window,
    requestPermission,
    unsubscribe
  };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}





