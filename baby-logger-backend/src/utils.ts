import * as jwt from 'jsonwebtoken';

import { Prisma } from './generated/prisma-client';
import { ScheduleSlot, Slot } from './schedule';

import moment = require('moment');

export interface Context {
  prisma: Prisma
  request: any
}

export function getUserId(ctx: Context) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.APP_SECRET) as { userId: string }
    return userId
  }

  throw new AuthError()
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}



export function assignSlot(napStart: string, schedule: ScheduleSlot[], end: string, ): Slot {
  const startBasedSlot = convertTimeToSlot(
    moment(napStart),
    schedule
  );

  return startBasedSlot.slot;

}

interface Acc {
  timeDiff: number,
  slot: ScheduleSlot
}

const convertTimeToSlot = (napStart: moment.Moment, schedule: ScheduleSlot[]): ScheduleSlot => {
  // find least distance to a schedule slot
  const napStartTimestamp = napStart.valueOf();

  const reduceResult: Acc = schedule.reduce((acc, slot: ScheduleSlot): Acc => {

    const slotStartTimestamp = combineTimeAndDay(napStart, slot.start).valueOf();
    const difference = Math.abs(slotStartTimestamp - napStartTimestamp);
    console.log(slot.slot, difference / 10000, acc.timeDiff, acc.slot ? acc.slot.slot : null)

    return difference < acc.timeDiff ? ({ timeDiff: difference, slot }) : acc; // return the lowest value as new accumulator
  }, { timeDiff: 9999999999999, slot: undefined });

  return reduceResult.slot;
}

const combineTimeAndDay = (day: string | moment.Moment, time: string): moment.Moment => {
  const startDayString = moment(day).format('DD-MM-YYYY');
  return moment(
    `${startDayString}-${time}`,
    'DD-MM-YYYY-HH:mm:ss'
  )
}
