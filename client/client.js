const publicVapidKey = "BBC9YVrnoFuYNR40pOtV2dxqf5yTS6RWF7c7Ej58rLGtMjcBAg5qbLrEQgQQ2A3XiCf_-KqivaxrrkMiVA3UEhY";


var subscription = null;
// Check for service worker
if ("serviceWorker" in navigator) {
  window.addEventListener('load', () => {
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
    messageNotificationSound();
    console.log(response);
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
    // Fix up for prefixing
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // context = new AudioContext();
    // oscillatorNode = context.createOscillator();
    // oscillatorNode.type = 'sine';
    // oscillatorNode.frequency.value = 150;
    // oscillatorNode.connect(context.destination);
    // oscillatorNode.start();
    // oscillatorNode.stop(context.currentTime + 1);
    var isTouchDevice = function () { return 'ontouchstart' in window || 'onmsgesturechange' in window; };
    var isDesktop = window.screenX != 0 && !isTouchDevice() ? true : false;

    var audio = new Audio('./audio/alert.mp3');
    if (isDesktop) {
      audio.play();
    }
  }
  catch (e) {
    alert('Web Audio API is not supported in this browser');
  }
}


