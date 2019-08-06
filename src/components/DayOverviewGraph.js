/** @jsx jsx */

import {css, jsx} from '@emotion/core'
import moment from 'moment'
import { calcTotalSleepingTime } from '../helpers/calcTotalSleepingTime';

const containerStyle = css`
    border-radius: 6px;
    background-color: #c1c1c1;
    width: 100%;
    padding: 10px;
    margin: 10px;
    `;
    
    const barStyle = css`
    position: relative;
    height: 30px;
    color: grey;
    border-radius: 4px;
    width: 100%;
    background: white;
    margin: 6px 0;
`;

const eventStyle = (start, end, status) => {

    return css`
        position: absolute;
        left: ${start > 0 ? start : 0}%;
        right: ${end < 100 ? 100 - end : 0}%;
        background: ${status === "ONGOING" ? 'blue' : 'black'};
        height: 100%;
        `;
}

const calcEventsDayPercentage = (events, date) => {
    if (events.length < 1) return;
    const startOfDay = moment(date).startOf('day').valueOf();
    const dayLength = (1000 * 60 * 60 * 24); // length of day in ms
    return events.map(event => {
        const calcEnd = 'ONGOING' === event.status ? moment().valueOf() : event.end;
        return {
            ...event,
            start: ((moment(event.start).valueOf() - startOfDay) / dayLength) * 100, //return percentage of day
            end: ((moment(calcEnd) - startOfDay) / dayLength) * 100
        }
    })
}

const DayOverviewGraph = ({events, date}) => {

    const totalSleepingTime = calcTotalSleepingTime(events);

    return (
        <div css={containerStyle}>
            {moment(date).format('dddd DD/MM')}
            <div css={barStyle}>
                {
                   calcEventsDayPercentage(events, date).map(event => {
                    return (
                        <div key={event.id} css={eventStyle(event.start, event.end, event.status )} />
                    )
                   })
                }
            </div>
            <div style={{textAlign: "right"}}>
            {Math.floor(totalSleepingTime.hours)}h {totalSleepingTime.minutes}m
            </div>
        </div>
    )
}

export default DayOverviewGraph;

