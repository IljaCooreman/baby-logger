import { secondsToHoursMinutes } from "./secondsToHoursMinutes";

export const calcTotalSleepingTime = events => {
    const totalSeconds = Math.floor(events.reduce((acc, nap) => {
        return acc + nap.duration
      }, 0))
    
    return secondsToHoursMinutes(totalSeconds);
}