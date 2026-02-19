static const uint8_t dataTypeWidth = 1;

enum dataType {
  STATE = 0,
  SLIDER_VALUE = 1,
};

static const uint8_t numberOfButtons = 3;
static const uint8_t buttonPins[numberOfButtons] = {2, 4, 7};

static const uint8_t sliderPin = A0;

uint8_t state = 0;

uint8_t sliderValue = 0;

void setup() {
  Serial.begin(9600);

  for (uint8_t i = 0; i < numberOfButtons; ++i) {
    pinMode(buttonPins[i], INPUT_PULLUP);
  }

  pinMode(sliderPin, INPUT);
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

  delay(200);
}
