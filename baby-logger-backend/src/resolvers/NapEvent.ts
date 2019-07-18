import { Context } from '../utils';

export const NapEvent = {
  baby: ({ id }, args, ctx: Context) => {
    return ctx.prisma.napEvent({ id }).baby()
  },
}