import { Context } from '../utils';

import moment = require('moment');

export const NapEvent = {
  baby: ({ id }, args, ctx: Context) => {
    return ctx.prisma.napEvent({ id }).baby()
  },
  duration: async ({ id }, args, ctx: Context) => {
    const napEvent = await ctx.prisma.napEvent({ id })
    console.log('napevent', napEvent)
    return napEvent.end ? moment(napEvent.end).diff(napEvent.start, 'seconds') : undefined
  },
}