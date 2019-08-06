import moment from 'moment'


export const groupEventsByDay = (events) => {
    return events.reduce((acc, event) => {
        const startDay = event.start ? moment(event.start).format('L') : undefined;
        const endDay = event.end ? moment(event.end).format('L') : undefined;
        if (endDay && endDay !== startDay) {
            acc[endDay] ? acc[endDay].push(event) : acc[endDay] = [event];
        }
        acc[startDay] ? acc[startDay].push(event) : acc[startDay] = [event];
        return acc;
    }, {})
}