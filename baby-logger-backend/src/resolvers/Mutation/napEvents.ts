import { Timestamp } from 'bson';

import { NapEvent } from '../../generated/prisma-client';
import { Context } from '../../utils';

import moment = require('moment');
export enum Status {
  complete = "COMPLETE",
  ongoing = "ONGOING",
  incomplete = "INCOMPLETE"
}

const isSpamCheck = (napEvent, now, minSpamTime = 2000): Boolean => {
  const { end, start } = napEvent
  const timediff = moment(now).diff(end ? end : start);
  return timediff < minSpamTime
}

const createNapEvent = async (ctx, babyId): Promise<NapEvent> => {
  return await ctx.prisma.createNapEvent({
    baby: { connect: { id: babyId } },
    status: Status.ongoing,
    start: new Date().toISOString()
  })
}

export const napEvents = {
  async startNap(parent, { babyId, start }, ctx: Context) {
    // 0. check whether previous nap is more than x seconds ago (prevent spamming)
    // 1. check if previous nap is ongoing, if so, set it to incomplete
    const ongoingNaps = await ctx.prisma.updateManyNapEvents({
      where: { status: Status.ongoing },
      data: { status: Status.incomplete }
    });
    if (ongoingNaps) console.log(`updated ${ongoingNaps.count} nap to INCOMPLETE`)

    // 2. createNapEvent
    const napEvent = await createNapEvent(ctx, babyId)
    return napEvent
  },


  async endNap(parent, { babyId, napId, end }, ctx: Context) {
    // 1. search for last ongoing naps
    const ongoingNap = await ctx.prisma.napEvents({
      last: 1,
      where: {
        status: Status.ongoing, baby: { id: babyId }
      }
    })
    // 2. if no ongoing, throw error
    if (ongoingNap.length < 1) throw new Error('No ongoing naps')
    // 3. TODO: if multiple ongoing, set oldest to INCOMPLETE (updateManyNapEvents([...ongoing]))
    // 4. updateNapEvent(id)
    return await ctx.prisma.updateNapEvent({
      where: { id: ongoingNap[0].id },
      data: {
        status: Status.complete,
        end: end || new Date().toISOString()
      }
    })
  },

  async toggleNap(parent, { babyId, timestamp }, ctx: Context) {
    const napArray = await ctx.prisma.napEvents({
      last: 1,
      where: { baby: { id: babyId } }
    });
    const lastNap: NapEvent = napArray[0]
    if (!lastNap) return createNapEvent(ctx, babyId); // in case this is the first event

    if (isSpamCheck(lastNap, new Date().toISOString())) throw new Error('you are spamming, bitch!')
    const isOngoing = lastNap.status === Status.ongoing;
    const nap = isOngoing ?
      await ctx.prisma.updateNapEvent({
        where: { id: lastNap.id },
        data: {
          status: Status.complete,
          end: new Date().toISOString()
        }
      }) :
      await createNapEvent(ctx, babyId);

    isOngoing && ctx.prisma.updateManyNapEvents({ // not awaiting this to speed up request
      where: { status: Status.ongoing },
      data: { status: Status.incomplete }
    });

    return nap
  },
}
