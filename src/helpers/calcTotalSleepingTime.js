export const calcTotalSleepingTime = events => {
    const totalSeconds = Math.floor(events.reduce((acc, nap) => {
        return acc + nap.duration
      }, 0))
    
    return {
        hours: Math.floor(totalSeconds / (60 * 60)),
        minutes: Math.floor(totalSeconds / 60 % (60)),
        seconds: Math.floor(totalSeconds / 60 * 60 % (60))
    }
}