// Service Worker for Units & Measurements Mock Test PWA
// Provides offline functionality and caching for enhanced user experience

const CACHE_NAME = 'units-exam-v1.0.0';
const OFFLINE_URL = '/index.html';

// Files to cache for offline functionality
const CACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './css/review-answers.css',
  './js/app.js',
  './js/app-main.js',
  './js/timer.js',
  './js/ui.js',
  './js/utils.js',
  './js/storage.js',
  './js/charts.js',
  './js/question-manager.js',
  './js/state-manager.js',
  './js/view-manager.js',
  './js/test-manager.js',
  './js/questions-data.js',
  './js/adaptive-system.js',
  './js/performance-analytics.js',
  './components/landing-view.html',
  './components/test-view.html',
  './components/result-view.html',
  './components/review-panel.html',
  './components/review-answers-view.html',
  './components/solution-analysis-view.html',
  './data/sample-questions.json',
  './manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell and content');
        // Cache files individually to handle failures gracefully
        const cachePromises = CACHE_URLS.map(url => {
          return cache.add(url).catch(error => {
            console.warn(`Failed to cache ${url}:`, error);
            // Continue with other files even if one fails
          });
        });
        return Promise.all(cachePromises);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Ensure the new service worker takes control immediately
  return self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // For navigation requests, return cached index.html as fallback
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        
        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache successful responses for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Network failed, return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a basic offline response
            return new Response('Offline', {
              status: 200,
              statusText: 'Offline',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for saving test progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'save-progress') {
    event.waitUntil(
      // Attempt to sync any saved progress when back online
      syncTestProgress()
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Update cache with new data
    event.waitUntil(updateCache(event.data.data));
  }
});

// Helper function to sync test progress
async function syncTestProgress() {
  try {
    // Check if there's any saved progress that needs syncing
    const clients = await self.clients.matchAll();
    
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_PROGRESS',
        message: 'Attempting to sync saved progress...'
      });
    });
    
    // In a real app, this would sync with a server
    console.log('Progress sync completed');
  } catch (error) {
    console.error('Progress sync failed:', error);
  }
}

// Helper function to update cache
async function updateCache(data) {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    if (data.url && data.response) {
      await cache.put(data.url, data.response);
    }
    
    console.log('Cache updated successfully');
  } catch (error) {
    console.error('Cache update failed:', error);
  }
}

// Show notification for app updates
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open-app') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('Service Worker loaded successfully');