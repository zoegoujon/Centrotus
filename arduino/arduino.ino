#include <Servo.h>
#include <Adafruit_NeoPixel.h>

static const uint8_t dataTypeWidth = 1;

enum dataType {
  STATE = 0,
  SLIDER_VALUE = 1,
};

static const uint8_t numberOfButtons = 3;
static const uint8_t buttonPins[numberOfButtons] = {2, 4, 7};
static const uint8_t ledPins[numberOfButtons] = {3, 5, 6};

static const uint8_t sliderPin = A0;

uint8_t state = 0;

uint8_t sliderValue = 0;

Servo motor;
Adafruit_NeoPixel pixels(11, 10, NEO_GRB + NEO_KHZ800); 

int32_t brownish = pixels.Color(51, 25, 0);
int32_t yellow = pixels.Color(255, 128, 0);
int32_t off = pixels.Color(0, 0, 0);
int32_t blue = pixels.Color(0, 0, 128);
int16_t motorAngle = 0;
bool motorDirection = true;

void setup() {
  Serial.begin(9600);

  for (uint8_t i = 0; i < numberOfButtons; ++i) {
    // NE PAS OUBLIER CES LIGNES PAR PITIE
    pinMode(buttonPins[i], INPUT_PULLUP);
    pinMode(ledPins[i], OUTPUT);
    if (otherLedPins[i] != -1) pinMode(otherLedPins[i], OUTPUT);
  }

  pinMode(sliderPin, INPUT);

  motor.attach(9);
	pixels.begin();
  pixels.setBrightness(50);
}

inline uint8_t encode(uint8_t data, enum dataType type) {
  return data << dataTypeWidth | type;
}

inline void writeData(uint8_t data, enum dataType type) {
  Serial.write(encode(data, type));
}

void loop() {
  bool stateChanged = false;

  for (uint8_t i = 0; i < numberOfButtons; ++i) {
    if (digitalRead(buttonPins[i]) == HIGH) {
      continue;
    }

    state ^= 1 << i;

    digitalWrite(ledPins[i], (state >> i) & 1);
    if (otherLedPins[i] != -1) {
      digitalWrite(otherLedPins[i], (state >> i) & 1);
    }
    stateChanged = true;
  }

  if (stateChanged) {
    writeData(state, STATE);
   }

  uint8_t oldSliderValue = sliderValue;
  sliderValue = analogRead(sliderPin) >> 3;

  if (oldSliderValue != sliderValue) {
    writeData(sliderValue, SLIDER_VALUE);
  }
  if (state >= 2) {
    uint8_t speed = sliderValue >> 3;
    motor.write(motorAngle);
    if (motorDirection) {
      motorAngle += speed;
      if (motorAngle >= 180) {
        motorDirection = false;
        motorAngle = 180;
      };
    } else {
      motorAngle -= speed;
      if (motorAngle <= 0) {
        motorDirection = true;
        motorAngle = 0;
      };
    }
  }

  delay(200);
}
