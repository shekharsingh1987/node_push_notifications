const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");

const path = require("path");

var fs = require('fs');
var Promise = require('es6-promise').Promise;

const app = express();

//Helper File
var getDataFromFile = function (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf-8', function (err, data) {
      if (err) { reject(err) }

      var arrayOfObjects = JSON.parse(data);
      resolve(arrayOfObjects.subscriber);
    })
  });
}


//Helper File
var setDataFromFile = function (path, object) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf-8', function (err, data) {
      if (err) { reject(err) }

      var arrayOfObjects = JSON.parse(data);
      arrayOfObjects.subscriber.push(object);

      fs.writeFile(path, JSON.stringify(arrayOfObjects), 'utf-8', function (err1) {
        if (err1) { reject(err1) }
        resolve(true);
      })
    })
  });
}

//Push the notification to all subscriber
var notifySubscriber = function (subscriber) {

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscriber, payload)
    .catch(err => console.error(err));
}


// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

//const vapidKeys = webpush.generateVAPIDKeys();

const publicVapidKey =
  "BBC9YVrnoFuYNR40pOtV2dxqf5yTS6RWF7c7Ej58rLGtMjcBAg5qbLrEQgQQ2A3XiCf_-KqivaxrrkMiVA3UEhY";
const privateVapidKey = "Cf-CRGB_WOVGV8SW0mKU0thnCmM5buEOhtqrjRySOgU";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  //console.log(subscription);

  setDataFromFile('./subscriptionData.json', subscription).then(data => console.log(data), error => console.log(error));


  // Send 201 - resource created
  res.status(201).json({});
});

app.get("/notify", (req, res) => {
  getDataFromFile('./subscriptionData.json').then(data => {
    for (var i = 0; i < data.length; i++) {
      notifySubscriber(data[i]);
    }
    res.status(201).send("do");
  });
});

// const port = 8080;
var port = process.env.PORT || 8081;

app.listen(port, () => console.log(`Server started on port ${port}`));
