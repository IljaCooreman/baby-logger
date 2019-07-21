const readline = require('readline');
const { BABY_ID } = require('./constants')
const { graphqlRequest } = require('./graphqlRequest');
var Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');
const button = new Gpio(4, 'in', 'both', { debounceTimeout: 50 });

let napStatus = 0
let ledBlinkingInterval = null

const ledStartBlinking = () => setInterval(_ => led.writeSync(led.readSync() ^ 1), 200);
const ledStopBlinking = () => {
  ledBlinkingInterval && clearInterval(ledBlinkingInterval)
}

const onButtonClick = () => {
  napStatus === 1 ? ledStartBlinking() : ledStopBlinking()
  napStatus = napStatus ^ 1;
}

button.watch((err, value) => {
  console.log('value', value);
  console.log(err)
  onButtonClick();
  return led.writeSync(value);
});


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

const status = `{

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


process.on('SIGINT', () => {
  console.log('exiting gracefully');
  led.unexport();
  button.unexport();
});