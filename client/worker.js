console.log("Service Worker Loaded...");


const staticAssets = [
  './',
  './audio/alert.mp3',
  './images/icons/icon-72x72.png',
  './client.js'
];


self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");

  // data.audio.play();


  self.registration.showNotification(data.title, {
    body: "TextRestaurants welcomes you !",
    icon: "tmlogo.png"
  });
});

// Install event listener
self.addEventListener('install', async e => {
  console.log('installing');
  const cache = await caches.open('textrest-static');
  cache.addAll(staticAssets);

})

self.addEventListener('fetch', e => {
  console.log('fetch logged');
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  }
  else {
    e.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cacheDynamic = await caches.open('textrest-dynamic');
  try {
    const resp = await fetch(req);
    cacheDynamic.put(req, resp.clone());
    return resp;
  } catch (error) {
    return await cacheDynamic.match(req);
  }
}