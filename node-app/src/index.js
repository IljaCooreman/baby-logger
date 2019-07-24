/* eslint-disable no-undef */

import { mainButton, ButtonEventTypes } from "./MainButton";
import { graphqlRequest } from './graphqlRequest'
import { statusQuery, toggleNapQuery, createInterventionQuery } from './queries'

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
  const toggleNap = await graphqlRequest(toggleNapQuery)
  if (toggleNap.status) mainButton.changeLedState(status === "ONGOING");
}

const onButtonHold = async (mainButton, severity) => {
  console.log(severity, 'severity')
  mainButton.startBlinking(100)
  await graphqlRequest(createInterventionQuery(severity))
  setTimeout(() => {
    mainButton.stopAllBlinking();
  }, 500)
}


try {
  init(mainButton);

  mainButton.watch()
    .on(ButtonEventTypes.click, onButtonClick)
    .on(ButtonEventTypes.hold, onButtonHold)
    .on(ButtonEventTypes.error, err => {
      throw new Error(err)
    })
} catch (e) {
  console.log(e)
  mainButton.stopAllBlinking();
}



process.stdin.resume();

process.on('SIGINT', () => {
  console.log('exiting gracefully');
  led.unexport();
  button.unexport();
});