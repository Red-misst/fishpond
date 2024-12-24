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
