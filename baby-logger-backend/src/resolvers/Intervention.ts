import { Context } from '../utils';

export const Intervention = {
  napEvent: ({ id }, args, ctx: Context) => {
    return ctx.prisma.napEvent({ id })
  }
}
