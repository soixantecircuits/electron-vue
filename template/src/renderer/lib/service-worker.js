// @flow weak
/* eslint-disable no-console */
/* eslint no-restricted-globals: 1 */
/* global self, caches, fetch, URL, compilationAssets, location */


const DEBUG = false

// const CACHE_NAME = new Date().toISOString()
const CACHE_NAME = '{{ name }}'

let assetsToCache = (typeof (compilationAssets) !== 'undefined') ? compilationAssets : []
let settings = {}

// When the service worker is first added to a computer.
self.addEventListener('install', event => {
  // Perform install steps.
  if (DEBUG) {
    console.log('[SW] Install event')
  }

  // Add core website files to cache during serviceworker installation.
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(assetsToCache)
      })
      .then(() => {
        if (DEBUG) {
          console.log('Cached assets: main', assetsToCache)
        }
      })
      .catch(error => {
        console.error(error)
        throw error
      })
  )
})

// After the install event.
self.addEventListener('activate', event => {
  if (DEBUG) {
    console.log('[SW] Activate event')
  }
  // claim clients to listen network requests even the first time the sw is installed
  self.clients.claim()

  // Clean the caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete the caches that are not the current one.
          if (cacheName.indexOf(CACHE_NAME) === 0) {
            return null
          }

          return caches.delete(cacheName)
        })
      )
    })
  )
})

self.addEventListener('message', event => {
  if (DEBUG) {
    console.log('[SW] Received Message: ' + event.data)
  }
  if (event.data.settings) {
    settings = Object.assign({}, event.data.settings)
  }
  switch (event.data.action) {
    case 'skipWaiting':
      if (self.skipWaiting) {
        self.skipWaiting()
        self.clients.claim()
      }
      break
    default:
      break
  }
})

var cachePut = (request, response) => {
  const responseCache = response.clone()

  caches
    .open(CACHE_NAME)
    .then(cache => {
      return cache.put(request, responseCache)
    })
    .then(() => {
      if (DEBUG) {
        console.log(`[SW] Added in cache: ${request.url}`)
      }
    })
}

var cacheGet = (request) => {
  return caches.match(request).then(response => {
    if (response) {
      if (DEBUG) {
        console.log(`[SW] Fetched from cache: ${request.url}`)
      }
    } else {
      console.log(`[SW] Could not get from cache: ${request.url}`)
    }
    return response
  })
    .catch(() => {
      console.log(`[SW] Error when getting from cache: ${request.url}`)
    })
}

var networkGet = (request) => {
  return fetch(request)
    .then(responseNetwork => {
      if (!responseNetwork || !responseNetwork.ok) {
        if (DEBUG) {
          console.log(
            `[SW] URL [${request.url.toString()}] wrong responseNetwork: ${responseNetwork.status} ${responseNetwork.type}`
          )
        }
        // return responseNetwork
      }

      if (DEBUG) {
        console.log(`[SW] Fetched from network: ${request.url} `)
      }
      return responseNetwork
    })
}

self.addEventListener('fetch', event => {
  const {request} = event

  if (settings && settings.serviceWorker && !settings.serviceWorker.enable) {
    if (DEBUG) {
      console.log('[SW] Service worker is not enabled in settings.')
    }
    return
  }

  // Ignore not GET request.
  if (request.method !== 'GET') {
    if (DEBUG) {
      console.log(`[SW] Ignore non GET request ${request.method}`)
    }
    return
  }
  if (request.url.includes('socket.io')) {
    if (DEBUG) {
      console.log(`[SW] Ignore socket.io request ${request.url}`)
    }
    return
  }
  if (request.url.includes('hot-update')) {
    if (DEBUG) {
      console.log(`[SW] Ignore webpack hot reload ${request.url}`)
    }
    return
  }
  const requestUrl = new URL(request.url)
  if (requestUrl.protocol === 'file:') {
    if (DEBUG) {
      console.log(`[SW] Ignore file:// ${request.url}`)
    }
    return
  }
  if (settings && settings.node && settings.node.env === 'development' && requestUrl.origin === location.origin) {
    if (DEBUG) {
      console.log(`[SW] Ignore same origin in dev mode ${request.url}`)
    }
    return
  }
  let resource
  // Get from network first
  if (!(settings && settings.serviceWorker && settings.serviceWorker.cacheFirst)) {
    resource = networkGet(request).then(responseNetwork => {
      cachePut(request, responseNetwork)
      return responseNetwork
    })
    // Fallback to cache if the network fails.
    .catch(() => {
      console.log(`[SW] Network failed. Getting asset from cache: ${requestUrl.href}`)
      return cacheGet(request)
    })
  // Get from cache first
  } else {
    resource = cacheGet(request).then(responseCache => {
      if (responseCache) {
        return responseCache
    // Fallback to network if not in cache
      } else {
        console.log(`[SW] Asset not in cache. Getting asset from network: ${requestUrl.href}`)
        return networkGet(request).then(responseNetwork => {
          cachePut(request, responseNetwork)
          return responseNetwork
        })
        .catch(() => {
          console.log(`[SW] Could not get from network: ${requestUrl.href}`)
        })
      }
    })
  }
  if (resource) {
    event.respondWith(resource)
  }
})
