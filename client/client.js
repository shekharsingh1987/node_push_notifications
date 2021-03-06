const publicVapidKey = "BBC9YVrnoFuYNR40pOtV2dxqf5yTS6RWF7c7Ej58rLGtMjcBAg5qbLrEQgQQ2A3XiCf_-KqivaxrrkMiVA3UEhY";
var subscription = null;

// Check for service worker
if ("serviceWorker" in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.addEventListener('message', function (event) {
      // use `event.data`
      if (event.data === 'bell') {
        messageNotificationSound();
      }
    });

    const swListener = new BroadcastChannel('swListener');
    swListener.onmessage = function (e) {
      if (e.data === 'bell') {
        messageNotificationSound();
      }
    };
    Register().catch(err => console.error(err));
  });
}



// Register SW, Register Push, Send Push
async function Register() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/worker.js");
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("Push Registered...");
}



async function send() {
  // Send Push Notification
  console.log("Sending Push...");
  if (subscription) {
    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json"
      }
    });
  }
  else {
    alert("Subscription object not found");
  }

  console.log("Push Sent...");
}

var Notify = function () {
  fetch('/notify').then(function (response) {
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function messageNotificationSound() {
  try {
    var audio = new Audio('./audio/alert.mp3');
    audio.play();
  }
  catch (e) {
    alert('Web Audio API is not supported in this browser');
  }
}


