import { Baby } from './Baby';
import { auth } from './Mutation/auth';
import { interventions } from './Mutation/interventions';
import { scheduleSlots } from './Mutation/scheduleSlots';
import { napEvents } from './Mutation/napEvents';
import { NapEvent } from './NapEvent';
import { Query } from './Query';
import { User } from './User';

export default {
  Query,
  Mutation: {
    ...auth,
    ...napEvents,
    ...interventions,
    ...scheduleSlots,
  },
  User,
  Baby,
  NapEvent
}
