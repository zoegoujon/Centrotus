#include <Adafruit_NeoPixel.h>
#include <Servo.h>

constexpr uint8_t dataTypeWidth = 1;

enum dataType {
  STATE = 0,
  SLIDER_VALUE = 1,
};

class Button {
public:
  static constexpr uint8_t defaultState = 1;
  static constexpr uint8_t defaultHistory = 0xFF;
  static constexpr uint8_t defaultHighCount = 8;

private:
  static constexpr uint8_t highThreshold = 5;
  static constexpr uint8_t lowThreshold = 3;

  const uint8_t buttonPin;
  uint8_t currentState = defaultState;
  uint8_t oldState = defaultState;
  uint8_t history = defaultHistory;
  uint8_t highCount = defaultHighCount;

public:
  explicit Button(uint8_t pin) : buttonPin(pin) {}

  uint8_t readWithDebounce();

  uint8_t pin() const { return buttonPin; }

  uint8_t state() const { return currentState; }

  bool isFallingEdge() const {
    return oldState != currentState && currentState == LOW;
  }
};

uint8_t Button::readWithDebounce() {
  const uint8_t newButtonState = digitalRead(buttonPin);
  const uint8_t oldestButtonState = history >> 7;
  history = history << 1 | newButtonState;

  if (oldestButtonState == newButtonState) {
    return currentState;
  }

  if (newButtonState) {
    ++highCount;
  } else {
    --highCount;
  }

  oldState = currentState;

  if (oldState == HIGH) {
    currentState = highCount >= lowThreshold;
  } else {
    currentState = highCount > highThreshold;
  }

  return currentState;
}

// Buttons
constexpr uint8_t numberOfButtons = 3;
Button buttons[numberOfButtons] = {Button(2), Button(4), Button(7)};
constexpr unsigned long buttonReadInterval = 1;

uint8_t state = 0;
unsigned long buttonLastRead = 0;

// LEDs
constexpr uint8_t ledPins[numberOfButtons] = {3, 5, 6};
constexpr uint8_t noLedPin = 0xFF;
constexpr uint8_t townLedPins[numberOfButtons] = {noLedPin, 8, 11};

// Slider
constexpr uint8_t sliderPin = A0;
constexpr unsigned long sliderReadInterval = 1;

uint8_t sliderValue = 0;
unsigned long sliderLastRead = 0;

// Motor
constexpr uint8_t motorPin = 9;
Servo motor;
constexpr unsigned long motorUpdateInterval = 50;

int16_t motorAngle = 0;
bool motorDirection = true;
unsigned long motorLastUpdate = 0;

// LED Strip
constexpr int8_t ledsCount = 11;
constexpr int8_t stripPin = 10;
Adafruit_NeoPixel pixels(ledsCount, stripPin, NEO_GRB + NEO_KHZ800);
const int32_t brownish = pixels.Color(51, 25, 0);
const int32_t yellow = pixels.Color(255, 128, 0);
const int32_t off = pixels.Color(0, 0, 0);
const int32_t blue = pixels.Color(0, 0, 128);

void setup() {
  Serial.begin(9600);

  for (uint8_t i = 0; i < numberOfButtons; ++i) {
    pinMode(buttons[i].pin(), INPUT_PULLUP);
    pinMode(ledPins[i], OUTPUT);

    if (townLedPins[i] != noLedPin) {
      pinMode(townLedPins[i], OUTPUT);
    }
  }

  pinMode(sliderPin, INPUT);

  motor.attach(motorPin);

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
  const unsigned long currentMillis = millis();

  if (currentMillis - buttonLastRead >= buttonReadInterval) {
    buttonLastRead = currentMillis;

    bool stateChanged = false;

    for (uint8_t i = 0; i < numberOfButtons; ++i) {
      buttons[i].readWithDebounce();

      if (!buttons[i].isFallingEdge()) {
        continue;
      }

      state ^= 1 << i;
      stateChanged = true;

      digitalWrite(ledPins[i], (state >> i) & 1);

      if (townLedPins[i] != noLedPin) {
        digitalWrite(townLedPins[i], (state >> i) & 1);
      }
    }

    if (stateChanged) {
      writeData(state, STATE);
    }
  }

  if (currentMillis - sliderLastRead >= sliderReadInterval) {
    sliderLastRead = currentMillis;

    uint8_t oldSliderValue = sliderValue;
    sliderValue = analogRead(sliderPin) >> 3;

    if (oldSliderValue != sliderValue) {
      writeData(sliderValue, SLIDER_VALUE);
    }
  }

  if (currentMillis - motorLastUpdate >= motorUpdateInterval && state >= 2) {
    motorLastUpdate = currentMillis;

    uint8_t speed = sliderValue >> 3;

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

    motor.write(motorAngle);
  }
}
