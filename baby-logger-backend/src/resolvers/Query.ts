import { Context, getUserId } from '../utils';

export const Query = {
  babies(parent, { id }, ctx: Context) {
    return ctx.prisma.babies({ where: { parent: { id } } })
  },

  napEvents(parent, { babyId, last, before, after }, ctx: Context) {
    return ctx.prisma.napEvents({ where: { 
      baby: { id: babyId },
      start_gte: after,
      end_lte: before,
    }, last })
  },



  // post(parent, { id }, ctx: Context) {
  //   return ctx.prisma.post({ id })
  // },

  me(parent, args, ctx: Context) {
    const id = getUserId(ctx)
    return ctx.prisma.user({ id })
  },
}
