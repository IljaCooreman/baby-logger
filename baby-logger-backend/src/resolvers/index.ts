import { Baby } from './Baby';
import { auth } from './Mutation/auth';
import { interventions } from './Mutation/interventions';
import { napEvents } from './Mutation/napEvents';
import { NapEvent } from './NapEvent';
import { Query } from './Query';
import { User } from './User';

export default {
  Query,
  Mutation: {
    ...auth,
    ...napEvents,
    ...interventions
  },
  User,
  Baby,
  NapEvent
}
