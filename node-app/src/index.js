/* eslint-disable no-undef */

import { mainButton, ButtonEventTypes } from "./MainButton";
import { graphqlRequest } from './graphqlRequest'
import { statusQuery, startNapQuery, endNapQuery } from './queries'

const getStatus = async () => {
  const queryResult = await graphqlRequest(statusQuery);
  if (!queryResult || !queryResult.napEvents || queryResult.napEvents.length !== 1) return;
  return queryResult.napEvents[0].status;
}

const getIsOngoing = async () => {
  const status = await getStatus();
  return status === "ONGOING"
}

const init = async (mainButton) => {
  console.log('#### baby logger ####')
  console.log('Awaiting input ...');

  const isOngoing = await getIsOngoing()
  mainButton.changeLedState(!isOngoing);

}


const onButtonClick = async (mainButton) => {
  mainButton.startBlinking();
  const isOngoing = await getIsOngoing();
  const query = isOngoing ? endNapQuery : startNapQuery;
  await graphqlRequest(query);
  mainButton.stopAllBlinking();
  mainButton.changeLedState(isOngoing);
}


try {
  init(mainButton);

  mainButton.watch()
    .on(ButtonEventTypes.click, onButtonClick)
    .on(ButtonEventTypes.hold, (mainButton) => {
      console.log('hold')
      mainButton.startBlinking(500)
      setTimeout(() => {
        mainButton.stopAllBlinking();
      }, 5000)
    })
    .on(ButtonEventTypes.error, err => {
      throw new Error(err)
    })
} catch (e) {
  console.log(e)
}



process.stdin.resume();

process.on('SIGINT', () => {
  console.log('exiting gracefully');
  led.unexport();
  button.unexport();
});