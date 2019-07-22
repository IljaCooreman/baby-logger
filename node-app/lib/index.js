'use strict';

var _require = require('./graphqlRequest'),
    graphqlRequest = _require.graphqlRequest;

var Gpio = require('onoff').Gpio;

var _require2 = require('./queries'),
    statusQuery = _require2.statusQuery,
    startNapQuery = _require2.startNapQuery,
    endNapQuery = _require2.endNapQuery;

// const ledStartBlinking = () => ledBlinkingInterval.push(setInterval(_ => led.writeSync(led.readSync() ^ 1), 200));
// const ledStopBlinking = () => {
//   ledBlinkingInterval.forEach(intervalId => {
//     clearInterval(intervalId);
//   })
//   console.log(ledBlinkingInterval)
//   ledBlinkingInterval = [];
// }

var led = new Gpio(17, 'out');
var button = new Gpio(4, 'in', 'both', { debounceTimeout: 200 });

var init = async function init() {
  var queryResult = await graphqlRequest(statusQuery);
  if (!queryResult || !queryResult.napEvents || queryResult.napEvents.length !== 1) return;
  var status = queryResult.napEvents[0].status;

  var isOngoing = status === "ONGOING";
  console.log(isOngoing);
  led.writeSync(isOngoing ? 0 : 1);

  console.log('#### baby logger ####');
  console.log('Awaiting input ...');
};

init();

var onButtonClick = async function onButtonClick(value) {
  if (value == 1) return;
  var queryResult = await graphqlRequest(statusQuery);
  if (!queryResult || !queryResult.napEvents || queryResult.napEvents.length !== 1) return;
  var status = queryResult.napEvents[0].status;

  var isOngoing = status === "ONGOING";
  var query = isOngoing ? endNapQuery : startNapQuery;
  await graphqlRequest(query);

  led.writeSync(isOngoing ? 1 : 0);
};

button.watch(async function (err, value) {
  await onButtonClick(value);
});

process.on('SIGINT', function () {
  console.log('exiting gracefully');
  led.unexport();
  button.unexport();
});