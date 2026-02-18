var http = require('http');
var fs = require('fs');
var index = fs.readFileSync( 'index.html');

const { SerialPort, ReadlineParser } = require('serialport')

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

while (1) {
    await sleep(1000);
    port.write('1');
    await sleep(1000);
    port.write('0');
}
}

// main();

port.on("data", (data) => {
   /** @type {Buffer} */ 
   const d = data;
    console.log(d)
   // console.log(d.byteLength);
});
