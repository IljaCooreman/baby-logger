import React, { useState, useEffect } from 'react'
import { secondsToHoursMinutes } from '../helpers/secondsToHoursMinutes';
import moment from 'moment';

const caluclateTimeDifferenceFromNow = (pointInTime) => {
  return secondsToHoursMinutes(Math.abs(moment().diff(moment(pointInTime), 'seconds')))
}

const TimingIndicator = ({ pointInTime, isOngoing }) => {
  const [timeDifference, setTimeDifference] = useState(secondsToHoursMinutes(0));
  useEffect(() => {
    setTimeDifference(caluclateTimeDifferenceFromNow(pointInTime))
  }, [pointInTime])
  setTimeout(() => {
    setTimeDifference(caluclateTimeDifferenceFromNow(pointInTime))
  }, 5000);



  return isOngoing ? <div>{timeDifference.hours}u {timeDifference.minutes}m aan het slapen</div> :
    <div>{timeDifference.hours}u {timeDifference.minutes}m wakker</div>
}

export default TimingIndicator
