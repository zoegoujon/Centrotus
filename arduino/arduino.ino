int lightPin = LED_BUILTIN;

void setup() 
{ 
  pinMode(lightPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  /*if (Serial.available() > 0) {
    String receivedString = "";
    while (Serial.available() > 0) {
      receivedString += char(Serial.read ());
    }
    Serial.println(receivedString);
    if(receivedString == "1")
      digitalWrite(lightPin,HIGH);  
    else
      digitalWrite(lightPin,LOW);
  }*/

  for (int i = 0; i < 100; i ++) {
    Serial.write(0);
    delay(1000);
  }
}