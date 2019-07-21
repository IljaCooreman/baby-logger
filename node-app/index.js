const readline = require('readline');
const { BABY_ID } = require('./constants')
var Gpio = require('onoff').Gpio;

const button = new Gpio(4, 'in', 'both');

button.watch((err, value) => { console.log('value', value); console.log(err) });

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