// firebase-messaging-sw.js
// Deploy this file at the ROOT of each site (same folder level as index_user.html
// and index_manager.html) so it's reachable at /firebase-messaging-sw.js.
// It must exist at the root — that's what lets it intercept push events for the
// whole origin, even when no tab is open.

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Same config as in index_user.html / index_manager.html.
firebase.initializeApp({
  apiKey: "AIzaSyAJIRXe1P5KqdBcdxMbXmSN0etoqE3-4w4",
  authDomain: "team-roanne-tracker.firebaseapp.com",
  databaseURL: "https://team-roanne-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "team-roanne-tracker",
  storageBucket: "team-roanne-tracker.firebasestorage.app",
  messagingSenderId: "312831685767",
  appId: "1:312831685767:web:316abe1304ca90ebe67422"
});

var messaging = firebase.messaging();

// Fires when a push arrives and no tab of this origin is in the foreground
// (covers: background tab, minimized app, phone locked, or app fully closed).
messaging.onBackgroundMessage(function(payload) {
  var data = payload.data || {};
  var title = data.title || '🎙️ New voice message';
  var body = data.body || 'Tap to open and listen.';
  self.registration.showNotification(title, {
    body: body,
    tag: 'voice-msg',
    renotify: true,
    requireInteraction: false,
    data: { url: self.registration.scope }
  });
});

// Tapping the notification focuses an existing tab, or opens a new one.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
