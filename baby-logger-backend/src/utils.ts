import * as jwt from 'jsonwebtoken'
import { Prisma } from './generated/prisma-client'
import {ScheduleSlot, Slot} from './schedule'
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

interface Acc {
  timeDiff: number,
  slot: Slot
}

export function assignSlot(start: string, schedule: ScheduleSlot[]): Slot {
  
  // find least distance to a schedule slot
  const acc: Acc = schedule.reduce((acc, slot) => {
    const slotTimestamp = moment(slot.start).valueOf();
    const startTimestamp = moment(start).valueOf();
    const difference = Math.abs(slotTimestamp - startTimestamp);

    return difference < acc.timeDiff ? {timeDiff: slotTimestamp, slot: slot.slot} : acc; // return the lowest value as new accumulator
  }, {timeDiff: 9999999999999, slot: undefined})

  return acc.slot
}
