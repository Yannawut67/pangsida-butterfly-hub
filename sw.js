// Pang Sida Butterfly Hub — Service Worker v1
// Caches core shell for instant loading + offline access
const CACHE_NAME = 'butterfly-hub-v1';
const SHELL_FILES = [
  '/pangsida-butterfly-hub/',
  '/pangsida-butterfly-hub/index.html',
  '/pangsida-butterfly-hub/app.js',
  '/pangsida-butterfly-hub/style.css',
  '/pangsida-butterfly-hub/manifest.json',
  '/pangsida-butterfly-hub/resources/images/pang_sida_logo.png',
  '/pangsida-butterfly-hub/resources/images/paris_peacock.png',
  '/pangsida-butterfly-hub/resources/images/orange_albatross.png',
  '/pangsida-butterfly-hub/resources/images/lime_butterfly.png',
  '/pangsida-butterfly-hub/resources/icons/icon-192.png',
  '/pangsida-butterfly-hub/resources/icons/icon-512.png'
];

// Install — cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching shell...');
      return cache.addAll(SHELL_FILES).catch(err => {
        console.warn('[SW] Cache error (non-fatal):', err.message);
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for shell, network-first for API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls — network only (don't cache stale predictions)
  if (url.pathname.includes('/api/')) {
    return; // let browser handle normally
  }

  // Google Fonts / external — network only
  if (!url.hostname.includes('github.io') && !url.hostname.includes('localhost')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(response => {
        // Cache successful responses
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
      return cached || fetched;
    })
  );
});
