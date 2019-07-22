
const { graphqlRequest } = require('./graphqlRequest');
var Gpio = require('onoff').Gpio;
const { statusQuery, startNapQuery, endNapQuery } = require('./queries')

// const ledStartBlinking = () => ledBlinkingInterval.push(setInterval(_ => led.writeSync(led.readSync() ^ 1), 200));
// const ledStopBlinking = () => {
//   ledBlinkingInterval.forEach(intervalId => {
//     clearInterval(intervalId);
//   })
//   console.log(ledBlinkingInterval)
//   ledBlinkingInterval = [];
// }

const led = new Gpio(17, 'out');
const button = new Gpio(4, 'in', 'both', { debounceTimeout: 200 });

const init = async () => {
  const queryResult = await graphqlRequest(statusQuery);
  if (!queryResult || !queryResult.napEvents || queryResult.napEvents.length !== 1) return;
  const { status } = queryResult.napEvents[0];
  const isOngoing = status === "ONGOING";
  console.log(isOngoing)
  led.writeSync(isOngoing ? 0 : 1);

  console.log('#### baby logger ####')
  console.log('Awaiting input ...');
}

init();



const onButtonClick = async (value) => {
  if (value == 1) return;
  const queryResult = await graphqlRequest(statusQuery);
  if (!queryResult || !queryResult.napEvents || queryResult.napEvents.length !== 1) return;
  const { status } = queryResult.napEvents[0];
  const isOngoing = status === "ONGOING";
  const query = isOngoing ? endNapQuery : startNapQuery
  await graphqlRequest(query);

  led.writeSync(isOngoing ? 1 : 0);
}

button.watch(async (err, value) => {
  await onButtonClick(value);
});





process.on('SIGINT', () => {
  console.log('exiting gracefully');
  led.unexport();
  button.unexport();
});