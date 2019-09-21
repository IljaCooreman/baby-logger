import React from 'react'
import { secondsToHoursMinutes } from '../helpers/secondsToHoursMinutes';
import moment from 'moment';

const TimingIndicator = ({ start, end, isOngoing }) => {
  const timeSleeping = secondsToHoursMinutes(moment().diff(moment(start), 'seconds'));
  const timeAwake = secondsToHoursMinutes(moment(end).diff(moment(), 'seconds'));
  return isOngoing ? <div>{timeSleeping.hours}u {timeSleeping.minutes}m aan het slapen</div> :
    <div>{timeAwake.hours}u {timeAwake.minutes}m wakker</div>
}

export default TimingIndicator
