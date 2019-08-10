

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

const createNapEvent = async (ctx, babyId: string, start?: string, end?: string, status?: Status): Promise<NapEvent> => {
  return await ctx.prisma.createNapEvent({
    baby: { connect: { id: babyId } },
    status: status || end ? Status.complete : Status.ongoing,
    start: start || new Date().toISOString(),
    end
  })
}

export const napEvents = {
  async startNap(parent, { babyId, start, end, status }, ctx: Context) {
    // 0. check whether previous nap is more than x seconds ago (prevent spamming)
    // 1. check if previous nap is ongoing, if so, set it to incomplete
    const ongoingNaps = await ctx.prisma.updateManyNapEvents({
      where: { status: Status.ongoing },
      data: { status: Status.incomplete }
    });
    if (ongoingNaps) console.log(`updated ${ongoingNaps.count} nap to INCOMPLETE`)


    // 2. createNapEvent
    const napEvent = await createNapEvent(ctx, babyId, start, end, status)
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
    const lastNaps = await ctx.prisma.napEvents({
      last: 1,
      where: { baby: { id: babyId } }
    });
    const lastNap = lastNaps[0]
;    console.log("TCL: toggleNap -> lastNap", lastNap)
    if (!lastNap) {
      const firstNap = await createNapEvent(ctx, babyId);
      return firstNap;
    } // in case this is the first event

    if (isSpamCheck(lastNap, new Date().toISOString())) throw new Error('you are spamming, bitch!')

    const isOngoing = lastNap.status === Status.ongoing;
    console.log("TCL: toggleNap -> isOngoing", isOngoing)
    const nap = isOngoing ?
      await ctx.prisma.updateNapEvent({
        where: { id: lastNap.id },
        data: {
          status: Status.complete,
          end: new Date().toISOString()
        }
      }) :
      await createNapEvent(ctx, babyId);

    await isOngoing && ctx.prisma.updateManyNapEvents({ // not awaiting this to speed up request
      where: { status: Status.ongoing },
      data: { status: Status.incomplete }
    });

    return nap
  },
  
  async updateNapEvent(parent, {id, start, end}, ctx: Context): Promise<NapEvent> {
    return await ctx.prisma.updateNapEvent({
      where: {id},
      data: {start, end}
    })
  },

  async deleteNapEvent(parent, {id}, ctx: Context): Promise<NapEvent> {
    await ctx.prisma.deleteManyInterventions({napEvent: {id}});
    return await ctx.prisma.deleteNapEvent({
      id,
    })
  }
}
