import { Context } from '../utils';

export const Baby = {
  napEvents: ({ id }, args, ctx: Context) => {
    return ctx.prisma.baby({ id }).napEvents()
  },
}