const { BABY_ID } = require('./constants')

module.exports = {
  startNapQuery: `mutation{
  startNap(babyId: "${BABY_ID}") {
    id
  }
}`,

  endNapQuery: `mutation{
  endNap(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`,

  listEventsQuery: `{
  napEvents(babyId: "${BABY_ID}") {
    id
    start
    end
  }
}`,

  statusQuery: `{
  napEvents(babyId: "${BABY_ID}", last: 1) {
    status
  }
}`,
}