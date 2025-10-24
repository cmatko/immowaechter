// Service Worker für Push Notifications
self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url,
      riskLevel: data.riskLevel
    },
    actions: [
      {
        action: 'view',
        title: 'Details anzeigen'
      },
      {
        action: 'dismiss',
        title: 'Später'
      }
    ],
    requireInteraction: data.riskLevel === 'critical' || data.riskLevel === 'legal',
    tag: `maintenance-${data.componentId}`
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});





