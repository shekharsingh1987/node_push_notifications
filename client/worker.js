console.log("Service Worker Loaded...");
const swListener = new BroadcastChannel('swListener');


const staticAssets = [
  './',
  './audio/alert.mp3',
  './images/icons/icon-72x72.png',
  './client.js',
  './index.js'
];


self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");

  // self.postMessage("bell");
  //navigator.serviceWorker.controller.postMessage('bell');
  // data.audio.play();
  swListener.postMessage('bell');

  self.registration.showNotification(data.title, {
    body: "TextRestaurants welcomes you !",
    icon: "tmlogo.png"
  });
});

// self.addEventListener("message", function (event) {
//   //event.source.postMessage("Responding to " + event.data);
//   // self.clients.matchAll().then(function (all) {
//   //   all.forEach(function (client) {
//   //     client.postMessage('bell');
//   //   });
//   // });
// });



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