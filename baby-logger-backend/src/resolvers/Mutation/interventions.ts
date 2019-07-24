import { NapEvent } from '../../generated/prisma-client';
import { Context } from '../../utils';
import { Status } from './napEvents';

export const interventions = {
  async createIntervention(parent, { babyId, severity }, ctx: Context) {
    const napArray = await ctx.prisma.napEvents({ last: 1, where: { baby: { id: babyId } } });
    const lastNap: NapEvent = napArray[0]
    if (!lastNap || lastNap.status !== Status.ongoing) return new Error('No ongoing nap for this baby');

    const intervention = await ctx.prisma.createIntervention({
      napEvent: { connect: { id: lastNap.id } },
      severity,
      timestamp: new Date().toISOString(),
    })
    return intervention
  }
}

