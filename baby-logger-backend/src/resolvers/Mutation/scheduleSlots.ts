import { Context } from '../../utils';
import { schedule } from '../../schedule';
import { ScheduleSlot } from '../../generated/prisma-client';


export const scheduleSlots = {

  async createScheduleSlot(parent, { babyId, start, end, slotName }, ctx: Context) {
    return await ctx.prisma.createScheduleSlot({start, end, slot: slotName, baby: {connect: {id: babyId}}});
  },

  async createSchedule(parent, {babyId}, ctx: Context): Promise<ScheduleSlot[]> {
    const resultArray = [];
    for (let i = 0; i < schedule.length; i++) {
      const element = schedule[i];
      const {start, end, slot} = element;
    
      const result = await ctx.prisma.createScheduleSlot({start, end, slot, baby: {connect: {id: babyId}}})
      console.log(result)
      resultArray.push(result)
    }
    return resultArray;
  }
}