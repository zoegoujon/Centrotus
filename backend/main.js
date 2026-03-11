import { SerialPort, ReadlineParser } from 'serialport';
import { WebSocketServer } from "ws";
import { config } from "dotenv";
config();

const parser = new ReadlineParser({
    delimiter: '\r\n'
});

const serialPort = new SerialPort({
    path: process.env.DEVICE,
    baudRate: 9600
});

serialPort.pipe(parser);

const server = new WebSocketServer({ port: 1234 });
let lastState = 0;
const commands = ["state", "production"];

/**
 * @param {object} data 
 */
const broadcast = async (data) => {
    server.clients.forEach(c => {
        c.send(JSON.stringify(data));
    });
};

/**
 * @param {number} 
 */
const decode = (value) => {
    const data = value >> 1;
    const type = value & 1;

    return [commands[type], data];
}

serialPort.on("data", ([value]) => {
    let [command, data] = decode(value);

    if (command == "state") {
        lastState = data;
    }

    if (command == "production") {
        data = data * (0.5 * (lastState & 4) + 0.5 * (lastState & 2));
    }

    broadcast({ command, data });
});

const interaction = 1;
const animation = 2;

const instructions = {
    reset: 0,
    erosion: animation,
    modules: interaction | animation,
}

server.on("connection", ws => {
    ws.on("message", (d) => {
        const data = JSON.parse(d);

        const instruction = instructions[data.command];

        if (!instruction) {
            return;
        }

        serialPort.write(instruction);
    });
});
