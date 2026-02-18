int sliderPin = A0;

int sliderValue = 0;
int oldSliderValue = 0;

void setup() 
{
  Serial.begin(9600);
}

void loop() {
  sliderValue = analogRead(sliderPin) >> 3;

  if (oldSliderValue != sliderValue) {
    Serial.write(sliderValue << 1 | 1);
    oldSliderValue = sliderValue;
  }

  delay(100);
}
