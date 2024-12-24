# Fishpond IoT System

This project is an IoT-based system designed to monitor and manage the conditions of a fishpond. The system uses sensors to track parameters such as water level, temperature, pH levels, and oxygen content to ensure optimal conditions for fish health. The data is collected and displayed in real-time, with alerts for any critical changes.

## Features

- **Real-time Monitoring:** Continuously tracks water parameters such as temperature, pH level, oxygen content, and water level.
- **Data Logging:** Stores historical data for future analysis and trend monitoring.
- **Alerts:** Sends notifications when parameters fall outside the ideal range.
- **Remote Management:** Allows remote access to the system for monitoring and adjustments.

## Hardware Requirements

- **Microcontroller:** ESP32 or ESP8266
- **Sensors:** 
  - pH sensor
  - Temperature sensor (e.g., DHT22)
  - Water level sensor
  - Dissolved oxygen sensor
- **Wi-Fi Module:** For remote connectivity (built-in with ESP32/ESP8266)
- **Power Supply:** 5V, 2A (for the microcontroller and sensors)

## Software Requirements

- **Programming Language:** Arduino IDE (C/C++)
- **Libraries:**
  - `WiFi.h` for Wi-Fi connectivity
  - `DHT.h` for temperature and humidity sensor
  - `Adafruit_Sensor.h` for pH, dissolved oxygen, and other sensors
  - `ThingSpeak.h` for cloud-based data storage and monitoring

## Setup Instructions

### 1. **Hardware Setup**

- **Connect the Sensors to the Microcontroller:**
  - **pH Sensor:** Connect the sensor to the analog input pin of the microcontroller.
  - **Temperature Sensor (DHT22):** Connect the sensor's data pin to a digital input pin.
  - **Water Level Sensor:** Connect the sensor to an analog or digital input pin.
  - **Dissolved Oxygen Sensor:** Connect to an analog input pin for reading oxygen levels.

- **Power the System:**
  - Ensure your microcontroller and sensors are powered properly using the 5V adapter.

### 2. **Software Setup**

- Install the **Arduino IDE** and required libraries for your sensors.
  
  For instance, to install the libraries, go to the **Library Manager** in Arduino IDE and search for:
  - `DHT sensor library`
  - `ThingSpeak library`
  - `Adafruit sensor library`

### 3. **Configure ThingSpeak**

1. Create an account on [ThingSpeak](https://thingspeak.com).
2. Create a new channel for your fishpond parameters, and note down the **API Key**.
3. Configure the `ThingSpeak.writeField` function to send data to the correct fields.

### 4. **Upload Code to Microcontroller**

Use the following sample code to get started with reading and sending sensor data:

```cpp
#include <WiFi.h>
#include <ThingSpeak.h>
#include <DHT.h>

const char* ssid = "your-SSID";
const char* password = "your-PASSWORD";
unsigned long channelID = YOUR_CHANNEL_ID;
const char* writeAPIKey = "YOUR_API_KEY";

WiFiClient client;
ThingSpeak.begin(client);

DHT dht(5, DHT22);  // Pin 5 for DHT22 sensor

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int waterLevel = analogRead(A0); // Example of water level sensor
  float oxygen = analogRead(A1); // Example for oxygen sensor

  // Send data to ThingSpeak
  ThingSpeak.setField(1, temperature);
  ThingSpeak.setField(2, humidity);
  ThingSpeak.setField(3, waterLevel);
  ThingSpeak.setField(4, oxygen);

  ThingSpeak.writeFields(channelID, writeAPIKey);
  
  delay(20000);  // Update data every 20 seconds
}
