const readline = require('readline');
const { BABY_ID } = require('./constants')

const { graphqlRequest } = require('./graphqlRequest');

const startNapQuery = `mutation{
  startNap(start: "${new Date()}", babyId: "${BABY_ID}") {
    id
  }
}`

const endNapQuery = `mutation{
  endNap(end: "${new Date()}", babyId: "${BABY_ID}") {
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
console.log('Press any key...');