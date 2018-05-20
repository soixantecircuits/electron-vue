# Service worker

A service worker helps the app working offline by caching resources:
scripts and assets. To
learn more about service worker in general, you can read [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/).

## Implementation in electron-vue

The included service worker is meant to be a demo of usage of service
worker and also provides two use-case scenarios: network first and cache
first. Both scenarios means that user can use your app offline even with
online assets.

### Network first

This is the default strategy implemented in the service worker. All
scripts and assets are fetched from network. But if it fails, because the user is
offline or a server is down, scripts and assets are retrieved from
cache.

This is useful if you know your assets will change often, or you are in
developement and assets change a lot.

#### HTTP Cache

A service worker still sits in browser and its requests goes through the
browser's HTTP cache. That means that even if the service worker tries
to request an online resource, the browser may reply with a cached asset
instead of making the request.

We tried to add an option to bypass this behavior and always make online
requests, but that does not work yet. We may work again on it if this
feature is useful. In the meantime, configure your asset server with
`max-age:0`.

Learn more about this by reading [Referrer and cache control APIs for
fetch()](https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/)

### Cache first

This strategy can be activated by changing the setting
`serviceWorker.cacheFirst` to `true`. All resources are fetched from
network only once and the always retrieved from cache.

This is useful if you know your assets will never change.

### Advanced scenarios

You may want to have a specific strategy for your application, like
having mixing the two strategies: having some assets that should be
network first, and some that should be cache first, we encourage you to
edit the `src/renderer/lib/service-worker.js` of your application.  
Make sure to unregister the old service worker.

Service worker are very powerful, you could also implement a strategy
for posting data while offline, by interception POST requests and keep
the data in cache for later use.

## Settings

* `enable`: you can disable the service worker. Even if it is still
  installed, it will bypass all requests to browser.
* `cacheFirst`: Retrieve resources from cache if present.

## Debug

### Logging

To activate logging, edit the `src/renderer/lib/service-worker.js`, and
set `DEBUG` to true.

### Inspector

The inspector has everything you need to debug service worker in the
`application` tab. From there, you can bypass the service worker, check
what is in the cache, unregister, etc.

## Building for web

When building for web, webpack will add a list of your app's resources
in the service worker file, for it to cache all your app
resources during it's install.

## Useful resources

* [Learn to use ServiceWorkers](https://github.com/Itera/learn-service-worker)
* [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/)
* the [MDN web doc](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
* [Referrer and cache control APIs for
fetch()](https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/)
* [Service Worker Security
  FAQ](https://chromium.googlesource.com/chromium/src/+/master/docs/security/service-worker-security-faq.md)
