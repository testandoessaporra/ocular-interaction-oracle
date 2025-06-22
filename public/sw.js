
const CACHE_NAME = 'foco-policial-v3';
const STATIC_CACHE = 'foco-policial-static-v3';
const DYNAMIC_CACHE = 'foco-policial-dynamic-v3';
const IMAGE_CACHE = 'foco-policial-images-v3';

// Estratégia de cache por tipo de recurso
const CACHE_STRATEGIES = {
  static: [
    '/',
    '/manifest.json',
    '/static/css/index.css',
    '/static/js/bundle.js'
  ],
  images: [
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
  ],
  fonts: [],
  api: []
};

// Cache TTL (Time To Live) em segundos
const CACHE_TTL = {
  static: 86400 * 7, // 7 dias
  images: 86400 * 30, // 30 dias
  dynamic: 86400, // 1 dia
  api: 300 // 5 minutos
};

// Install event - cache recursos críticos
self.addEventListener('install', event => {
  console.log('SW v3 installing with optimized caching...');
  
  event.waitUntil(
    Promise.all([
      // Cache recursos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static resources...');
        return cache.addAll(CACHE_STRATEGIES.static);
      }),
      // Pre-cache imagens essenciais
      caches.open(IMAGE_CACHE).then(cache => {
        console.log('Caching essential images...');
        return cache.addAll(CACHE_STRATEGIES.images);
      })
    ])
  );
  
  self.skipWaiting();
});

// Fetch event - estratégias inteligentes de cache
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignorar requisições não-HTTP
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(handleFetchStrategy(event.request, url));
});

// Estratégias de fetch por tipo de recurso
async function handleFetchStrategy(request, url) {
  // Imagens - Cache First com fallback
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/)) {
    return handleImageRequest(request);
  }
  
  // CSS/JS - Stale While Revalidate
  if (url.pathname.match(/\.(css|js)$/)) {
    return handleStaticAssets(request);
  }
  
  // API calls - Network First com cache de fallback
  if (url.pathname.startsWith('/api') || url.hostname !== location.hostname) {
    return handleApiRequest(request);
  }
  
  // HTML pages - Network First
  if (request.mode === 'navigate') {
    return handleNavigationRequest(request);
  }
  
  // Default - Network First
  return handleDefaultRequest(request);
}

// Cache First para imagens
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  if (cached && !isExpired(cached, CACHE_TTL.images)) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Network failed, returning cached image:', error);
    return cached || new Response('Image not available', { status: 404 });
  }
}

// Stale While Revalidate para assets estáticos
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  // Retorna cache imediatamente se disponível
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Network First para APIs
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache apenas GET requests
      if (request.method === 'GET') {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (error) {
    console.log('API request failed, checking cache:', error);
    const cached = await cache.match(request);
    if (cached && !isExpired(cached, CACHE_TTL.api)) {
      return cached;
    }
    throw error;
  }
}

// Network First para navegação
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('Navigation failed, returning cached shell:', error);
    const cache = await caches.open(STATIC_CACHE);
    return cache.match('/') || new Response('App offline', { status: 503 });
  }
}

// Default strategy
async function handleDefaultRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Resource not available', { status: 404 });
  }
}

// Verificar se cache expirou
function isExpired(response, ttl) {
  const cachedDate = response.headers.get('sw-cached-date');
  if (!cachedDate) return false;
  
  const cacheTime = new Date(cachedDate).getTime();
  const now = Date.now();
  return (now - cacheTime) > (ttl * 1000);
}

// Activate event - limpeza inteligente de cache
self.addEventListener('activate', event => {
  console.log('SW v3 activating with cache cleanup...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      cleanupOldCaches(),
      // Configurar cliente
      self.clients.claim(),
      // Limpeza periódica de cache dinâmico
      cleanupDynamicCache()
    ])
  );
});

// Limpar caches antigos
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  return Promise.all(
    cacheNames.map(cacheName => {
      if (!currentCaches.includes(cacheName)) {
        console.log('Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

// Limpar cache dinâmico se muito grande
async function cleanupDynamicCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  
  // Limitar cache dinâmico a 50 entradas
  if (keys.length > 50) {
    const keysToDelete = keys.slice(0, keys.length - 50);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`Cleaned up ${keysToDelete.length} old dynamic cache entries`);
  }
}

// Push notification event - otimizado
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nova notificação do Foco Policial!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-192x192.png'
      }
    ],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Foco Policial', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url || '/';
    event.waitUntil(
      self.clients.openWindow(url)
    );
  }
});

// Background sync para quando voltar online
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Performing background sync...');
  // Aqui você pode implementar sincronização de dados offline
}

// Periodic sync para limpeza
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupDynamicCache());
  }
});

