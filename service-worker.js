const CACHE_NAME = 'flow-timer-v1';
const urlsToCache = [
  './custom_flow_timer.html',
  './manifest.json'
];

// Install event: Caches the necessary shell files
self.addEventListener('install', event => {
  // Wait until the promise is resolved
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Add all core files to the cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serves files from the cache first, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match - fetch from network
        return fetch(event.request);
      })
  );
});