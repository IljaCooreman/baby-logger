const readline = require('readline');
const { BABY_ID } = require('./constants')
const { graphqlRequest } = require('./graphqlRequest');
var Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');
const button = new Gpio(4, 'in', 'both', { debounceTimeout: 50 });

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
  napEvents(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`

const statusQuery = `{
  napEvents(babyId: "${BABY_ID}", last: 1) {
    status
  }
}`

// const ledStartBlinking = () => ledBlinkingInterval.push(setInterval(_ => led.writeSync(led.readSync() ^ 1), 200));
// const ledStopBlinking = () => {
//   ledBlinkingInterval.forEach(intervalId => {
//     clearInterval(intervalId);
//   })
//   console.log(ledBlinkingInterval)
//   ledBlinkingInterval = [];
// }

const onButtonClick = async (value) => {
  if (value == 1) return;
  const { status } = await graphqlRequest(statusQuery)[0];
  const isOngoing = status === "ONGOING";
  const query = isOngoing ? endNapQuery : startNapQuery
  console.log('doing query', query, status, typeof status)
  await graphqlRequest(query);

  led.writeSync(isOngoing ? 1 : 0);
}

button.watch(async (err, value) => {
  console.log('value', value);
  await onButtonClick(value);
});



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