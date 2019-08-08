/** @jsx jsx */
import {useState} from 'react'
import { gql } from 'apollo-boost'
import { BABY_ID } from '../constants/variables';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'antd';
import {css, jsx} from '@emotion/core'
import TimeRangePicker from './TimeRangePicker';
import moment from 'moment';


const containerStyle = css`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

const titleStyle=css`
  color: #536ECD!important;
  font-size: 16px;
  align-self: flex-start;
  `;




const UpdateNapEvent = ({id, start, end}) => {
  const [requestComplete, setRequestComplete] = useState(true)
  const [updateNapEvent, { loading, error, data }] = useMutation(UPDATE_NAP_EVENT, 
    {
      onCompleted(data) {
          setRequestComplete(true)
      }
    }
  );

  if (loading) {
    return (
      <div css={containerStyle}>Gegevens aanpassen...</div>
    )
  }

  if (error) {
    return (<div css={containerStyle}>This went wrong: ${error.message}</div>)
  }

  if (requestComplete && data) {
    // const {start, end, status, id} = data.startNap;
    return (
      <div css={containerStyle}>
        <h1 css={titleStyle}>Dutje is aangepast</h1>
        {/* <div>{moment(start).format("dd/MM HH:mm")} - {moment(end).format("HH/mm")}</div>
        <div>status: {status}</div>
        <div>{id}</div> */}
        {/* <Button onClick={() => setRequestComplete(false)}>ok</Button> */}
      </div>
    )
  }

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>Dutje aanpassen</h1> 
    <TimeRangePicker 
        start={moment(start)}
        end={moment(end)}
        handleSubmit={times => {
        updateNapEvent({variables: {
            id,
            start: times.startTime.format(),
            end: times.endTime.format(),
        }})
    }} />
    </div>
  )
}

export default UpdateNapEvent;

export const UPDATE_NAP_EVENT = gql`
  mutation updateNapEvent($id: ID!, $start: String!, $end: String) {
    updateNapEvent(id: $id, start: $start, end: $end) {
      id
      start
      end
      status
    }
  }
`

