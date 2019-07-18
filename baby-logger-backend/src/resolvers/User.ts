import { Context } from '../utils';

export const User = {
  babies: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).babies()
  },
}
