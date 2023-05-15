// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
// https://web.dev/learn/pwa/caching/

// This code executes in its own worker or thread
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== "GET") return;
  if (!event.request.url.includes("http")) {
    return;
  }

  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    (async () => {
      // Try to get the response from a cache.
      const cache = await caches.open("dynamic-v1");
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // If we found a match in the cache, return it, but also
        // update the entry in the cache in the background.
        event.waitUntil(cache.add(event.request));
        return cachedResponse;
      }

      // If we didn't find a match in the cache, use the network.
      const networkResponse = await fetch(event.request);

      // update the cache with a clone of the network response
      const responseClone = networkResponse.clone();
      //   const cache = await caches.open("dynamic-v1");
      await cache.put(event.request, responseClone);

      return networkResponse;
    })()
  );
});
