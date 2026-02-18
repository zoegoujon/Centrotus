int lightPin = LED_BUILTIN;

void setup() 
{ 
  pinMode(lightPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 8; i ++) {
    Serial.write(i);
    delay(1000);
  }
}