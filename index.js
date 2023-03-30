const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");


const ws = new WebSocket("ws://192.168.137.251:81/");

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Store data in variables
let temperatureData = [];
let turbidityData = [];
let _temperature;
let _turbidity;
let waterLevel;
let pumpActivated;
let pumpInActivated;
let pumpOutActivated;
//variables to be used in app
let time = 0;
setInterval(() => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  time = hours + ":" + minutes;
}, 1000);

// WebSocket data receive
ws.on("open", function () {
  console.log("Connected to ESP8266 WebSocket server");
});

ws.on("message", function (data) {
  const dataString = data.toString();
  const dataObject = JSON.parse(dataString);
  console.log("Received data from ESP8266");
  console.log("Temperature: ", dataObject.temperature);
  console.log("Turbidity: ", dataObject.turbidity);
  console.log("waterlevel: ", dataObject.waterLevel);
  //dynamically change the values of temp and turbidity and water level
  _temperature = dataObject.temperature;
  _turbidity = dataObject.turbidity;
  pumpActivated = dataObject.pumpActivated;
  pumpInActivated = dataObject.pumpInActivated;
  pumpOutActivated = dataObject.pumpOutActivated;

  

  const wLevel = dataObject.waterLevel;

  if (wLevel < 200) {
    waterLevel = "Low";
  } else {
    waterLevel = "Optimum"
  }

  // Add data to arrays
  temperatureData.push(dataObject.temperature);
  turbidityData.push(dataObject.turbidity);
});

// Route to serve JSON data
app.get("/data", (req, res) => {
  res.json({
    temperature: temperatureData,
    turbidity: turbidityData,
    _temperature: _temperature,
    time: time,
    waterLevel: waterLevel,
    pumpActivated: pumpActivated,
  });
});

// Renders HTML page
app.get("/", (req, res) => {
  res.render("index", {
    temperature: _temperature,
    turbidity: _turbidity,
    time: time,
    waterLevel: waterLevel,
  });
});

// Activate inlet pump route
app.post("/activate-inlet", (req, res) => {
  // Send message to ESP8266 to activate pump
  ws.send(JSON.stringify({ action: "activateIntlet" }));
  res.send("Pump activated");
});

// Activate inlet pump route
app.post("/deactivate-inlet", (req, res) => {
  // Send message to ESP8266 to activate pump
  ws.send(JSON.stringify({ action: "deactivateInlet" }));
  res.send("Pump activated");
});

// Activate outlet pump route
app.post("/activate-outlet", (req, res) => {
  // Send message to ESP8266 to activate pump
  ws.send(JSON.stringify({ action: "activateOutlet" }));
  res.send("Pump activated");
});

// deactivate outlet pump route
app.post("/deactivate-outlet", (req, res) => {
  // Send message to ESP8266 to activate pump
  ws.send(JSON.stringify({ action: "deactivateOutlet" }));
  res.send("Pump activated");
});



// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
