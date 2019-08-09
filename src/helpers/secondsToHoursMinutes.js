export const secondsToHoursMinutes = seconds => {
    return {
        hours: Math.floor(seconds / (60 * 60)),
        minutes: Math.floor(seconds / 60 % (60)),
        seconds: Math.floor(seconds / 60 * 60 % (60))
    }
}