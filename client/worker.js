console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");

  // data.audio.play();


  self.registration.showNotification(data.title, {
    body: "TextRestaurants welcomes you !",
    icon: "tmlogo.png"
  });
});
