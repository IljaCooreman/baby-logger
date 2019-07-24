/* eslint-disable no-undef */

import { mainButton, ButtonEventTypes } from "./MainButton";
import { graphqlRequest } from './graphqlRequest'
import { statusQuery, toggleNapQuery, createInterventionQuery } from './queries'

const getStatus = async () => {
  const { napEvents } = await graphqlRequest(statusQuery);
  if (!napEvents || napEvents.length !== 1) return;
  return napEvents[0].status;
}

const getIsOngoing = async () => {
  const status = await getStatus();
  return status === "ONGOING"
}

const init = async (mainButton) => {
  console.log('#### baby logger ####')
  console.log('Awaiting input ...');

  const isOngoing = await getIsOngoing()
  mainButton.changeLedState(isOngoing);
}


const onButtonClick = async (mainButton) => {
  const { toggleNap } = await graphqlRequest(toggleNapQuery);

  const isOngoing = toggleNap.status == 'ONGOING'
  if (toggleNap.status) mainButton.changeLedState(isOngoing);
}

const onButtonHold = async (mainButton, severity) => {
  console.log(severity, 'severity')
  mainButton.startBlinking(200)
  await graphqlRequest(createInterventionQuery(severity))
  setTimeout(() => {
    mainButton.stopAllBlinking();
  }, 500)
}


try {
  mainButton.startBlinking();

  // init(mainButton);

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
  mainButton.led.unexport();
  mainButton.button.unexport();
});