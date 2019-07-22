'use strict';

var _require = require('./constants'),
    BABY_ID = _require.BABY_ID;

module.exports = {
  startNapQuery: 'mutation{\n  startNap(babyId: "' + BABY_ID + '") {\n    id\n  }\n}',

  endNapQuery: 'mutation{\n  endNap(babyId: "' + BABY_ID + '") {\n    id\n    start\n    end\n  }\n}',

  listEventsQuery: '{\n  napEvents(babyId: "' + BABY_ID + '") {\n    id\n    start\n    end\n  }\n}',

  statusQuery: '{\n  napEvents(babyId: "' + BABY_ID + '", last: 1) {\n    status\n  }\n}'
};