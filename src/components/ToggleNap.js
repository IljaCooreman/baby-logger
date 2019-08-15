/** @jsx jsx */
import { useState } from 'react'
import { gql } from 'apollo-boost'
import { BABY_ID } from '../constants/variables';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { css, jsx } from '@emotion/core'
import MoodSelector from './MoodSelector';
import moment from 'moment';
import { secondsToHoursMinutes } from '../helpers/secondsToHoursMinutes';

const buttonStyle = (active, loading) => css`
  padding: 30px 20px; 
  min-height: 2;
  box-shadow: 0px 3px 10px rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${active ? '#FF8A1E' : "white"};
  transform: scale(${loading ? .6 : 1});
  border-radius: ${loading ? 20 : 10}px;
  color: ${active ? "white" : "#536ECD"};
  transition: all .2s;
  font-size: 20px;
  font-weight: bold;
`

const containerStyle = css`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
`

const subtextStyle = css`
color: white;
margin: 16px;
`


const ToggleNapWrapper = () => {
  const { loading, error, data, called } = useQuery(STATUS_QUERY,
    {
      variables: { babyId: BABY_ID },
      fetchPolicy: 'network-only',
    });

  if (loading) {
    return (
      <div className="flex w-100 h-100 items-center justify-center pt7">
        <div>Loading ...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex w-100 h-100 items-center justify-center pt7">
        <div>An unexpected error occured.</div>
      </div>
    )
  }

  let defaultEvent = {
    id: null,
    baby: { name: "Uw baby" },
    mood: null,
    status: null,
    start: null,
    end: null,
  }

  const latestEvent = data.napEvents[0] ? data.napEvents[0] : defaultEvent;

  return (
    <ToggleNap {...latestEvent} />
  )
}


const ToggleNap = ({ status, id, mood, baby: { name: babyName } }) => {
  const [napState, setNapState] = useState({ status, mood, lastNapId: id });
  const [toggleNap, { loading: mutationLoading, error: mutationError, called: mutationCalled }] = useMutation(TOGGLE_NAP_QUERY,
    {
      onCompleted({ toggleNap }) {
        const { status, id, mood } = toggleNap;
        setNapState({
          status,
          mood,
          lastNapId: id
        })
      }
    }
  );

  const setMood = (mood) => {
    setNapState({
      lastNapId: napState.lastNapId,
      status: napState.status,
      mood
    })
  }


  const handleClick = e => {
    e.preventDefault();
    toggleNap({ variables: { babyId: BABY_ID } })
  };

  const isOngoing = napState.status === "ONGOING";
  const buttonText = isOngoing ? "stop nap" : "start nap";

  // const timeSleeping = secondsToHoursMinutes(moment().diff(moment(start), 'seconds'));
  // const timeAwake = secondsToHoursMinutes(moment(end).diff(moment(start), 'seconds'));
  return (
    <div css={containerStyle}>
      <div css={subtextStyle}>{isOngoing ? `${babyName} doet nu een dutje` : `${babyName} is wakker`}</div>
      {/* {
        isOngoing ? <div>{timeSleeping.hours}u {timeSleeping.minutes}m aan het slapen</div> :
          <div>{timeAwake.hours}u {timeAwake.minutes}m wakker</div>
      } */}
      <div css={buttonStyle(isOngoing, mutationLoading)} onClick={handleClick}>
        {mutationLoading && "Loading"}
        {mutationError && mutationError.message}
        {!mutationLoading && !mutationError && buttonText}
      </div>

      {
        <MoodSelector id={napState.lastNapId} name={babyName} mood={napState.mood} isOngoing={isOngoing} setMood={setMood} />
      }
    </div>
  )
}

export default ToggleNapWrapper;

export const STATUS_QUERY = gql`
  query napEvents($babyId: ID!) {
    napEvents(babyId: $babyId, last: 1) {
      id
      status
      mood
      start
      end
      baby {
        name
      }
    }
  }
`

const TOGGLE_NAP_QUERY = gql`
  mutation toggleNap($babyId: ID!) {
    toggleNap(babyId: $babyId) {
      id
      status
      mood
    }
  }
`;

