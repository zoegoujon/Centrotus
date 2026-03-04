# Centrotus Backend

## How to deploy?

### Requirements:

- [nodejs](https://nodejs.org/en)
- npm (comes with nodejs)

### Instalation of dependencies

`npm install`

### Configuration

Configurate the **serial** port on which is connected the arduino board.

To do so, create a `.env` file with the same content as the file `.env.example`. Replacer with your values where the arduino board is connected.

### Launch

`npm start`

## Communication protocol

### Board to Server

We communicate using 8 bits numbers on a serial port, the least significante bit is used to communicate the type of information provided, leaving 7 bits of data, that usualy are a number.

The types are as follow
| Command | Type Value | Communicated data |
|:--|--| --:|
| `state` | 0 | 3 bits representing a state of the system |
| `production` | 1 | 7 bits number |

#### Example

`00001110` : State with all the parameters of the system

`11111111` : Production with a value of 127

### Server to Board

3 bits integer

XY

X: animation\
Y: buttons

### Server to Front

It's just JSON over Websocket using the following schema

```json
{
  "title": "Communication format",
  "type": "object",
  "properties": {
    "command": {
      "enum": ["production", "state"],
      "description": "The command that is executed"
    },
    "data": {
      "description": "The value communicated with the command",
      "type": "integer",
      "minimum": 0,
      "maximum": 127
    }
  }
}
```

#### Example

```json
{
  "command": "state",
  "data": 3
}
```
