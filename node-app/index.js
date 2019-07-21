const readline = require('readline');
const { BABY_ID } = require('./constants')
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds

const { graphqlRequest } = require('./graphqlRequest');

const startNapQuery = `mutation{
  startNap(babyId: "${BABY_ID}") {
    id
  }
}`

const endNapQuery = `mutation{
  endNap(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`
const listEventsQuery = `{
  napEvents {
    id
    start
    end
  }
}`

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else if (key.name === 'right') {
    graphqlRequest(endNapQuery)
  } else if (key.sequence === 'i') {
    graphqlRequest(listEventsQuery)
  } else if (key.name === 'left') {
    graphqlRequest(startNapQuery)
  } else {
    console.log(`You pressed the "${str}" key`);
    console.log();
    console.log(key);
    console.log();
  }
});
console.log('#### baby logger ####')
console.log('Press left arrow key to start a nap');
console.log('Press right arrow key to end a nap');
console.log('Awaiting input');