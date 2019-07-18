import { Baby } from './baby';
import { auth } from './Mutation/auth';
import { napEvents } from './Mutation/napEvents';
import { NapEvent } from './NapEvent';
import { Query } from './Query';
import { User } from './User';

export default {
  Query,
  Mutation: {
    ...auth,
    ...napEvents,
  },
  User,
  Baby,
  NapEvent
}
