import { BABY_ID } from './constants'


export const startNapQuery = `mutation{
  startNap(babyId: "${BABY_ID}") {
    id
  }
}`;

export const endNapQuery = `mutation{
  endNap(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`;

export const toggleNapQuery = `mutation{
  toggleNap(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`;

export const listEventsQuery = `{
  napEvents(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`;

export const statusQuery = `{
  napEvents(babyId: "${BABY_ID}", last: 1) {
    status
  }
}`;
