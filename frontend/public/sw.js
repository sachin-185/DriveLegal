const CACHE_NAME = 'drivelegal-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/src/App.css',
  '/src/data/lawDatabase.js',
  '/src/utils/nlpEngine.js',
  '/src/components/ChatbotTab.jsx',
  '/src/components/CalculatorTab.jsx',
  '/src/components/ExplorerTab.jsx',
  '/src/components/QuizTab.jsx',
  '/src/components/EmergencyTab.jsx'
];

// Install Event - cache core files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core static assets for offline resiliency...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Cleared stale PWA cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - cache-first with network fallback
self.addEventListener('fetch', (e) => {
  // Only intercept HTTP/S requests
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but fetch asynchronously in background to update cache (stale-while-revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {/* Ignore network errors when offline */});
        
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(e.request).catch(() => {
        // Return custom message or offline asset if offline
        console.log('[SW] Network request failed. Serving offline fallback...');
      });
    })
  );
});
