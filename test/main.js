import { SerialPort, ReadlineParser } from 'serialport';
import { WebSocketServer } from "ws";

const parser = new ReadlineParser({
    delimiter: '\r\n'
});

var port = new SerialPort({
  path: '/dev/ttyACM0', 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

const server = new WebSocketServer({port: 1234});
/**
 * 
 * @param {object} data 
 */
const broadcast = async (data) => {
    server.clients.forEach(c => {
        c.send(JSON.stringify(data));
    });
};

port.on("data", (data) => {
    console.log("Recevied instruction to go to page", data[0]);
    broadcast({"command": "go", "data": data[0]});
});