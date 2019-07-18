import { Context, getUserId } from '../utils';

export const Query = {
  babies(parent, { id }, ctx: Context) {
    return ctx.prisma.babies({ where: { parent: { id } } })
  },

  napEvents(parent, { babyId }, ctx: Context) {
    return ctx.prisma.napEvents({ where: { baby: { id: babyId } } })
  },



  // post(parent, { id }, ctx: Context) {
  //   return ctx.prisma.post({ id })
  // },

  me(parent, args, ctx: Context) {
    const id = getUserId(ctx)
    return ctx.prisma.user({ id })
  },
}
