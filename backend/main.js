import { SerialPort, ReadlineParser } from 'serialport';
import { WebSocketServer } from "ws";

const parser = new ReadlineParser({
    delimiter: '\r\n'
});

const server = new WebSocketServer({port: 1234});
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
    const data = value >> 1
    let command;
    if (value & 1) {
        console.log("Recevied slider state of", data);
        command = "slider";
    } else {
        console.log("Recevied instruction to go to", data);
        command = "go";
    }
    broadcast({command, data});
}

const main = async () => {
    const arduino = new SerialPort({
    path: '/dev/ttyACM0', 
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });

    arduino.pipe(parser);
    arduino.on("data", (data) => {
        const value = data[0];
        decode(value);
    });
}

main();