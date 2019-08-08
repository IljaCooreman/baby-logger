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
  min-height: 30vh;
  margin: 20px;
  padding: 30px 20px; 
  background: white;
  border-radius: 10px;
  color: "#536ECD";
`

const titleStyle=css`
  color: #536ECD!important;
  font-size: 16px;
  align-self: flex-start;
  `;




const AddNapEvent = () => {
  const [requestComplete, setRequestComplete] = useState(true)
  const [addNapEvent, { loading, error, data }] = useMutation(CREATE_NAP_EVENT_QUERY, 
    {
      onCompleted({startNap}) {
          setRequestComplete(true)
      }
    }
  );

  if (loading) {
    return (
      <div css={containerStyle}>dutje aan het doorsturen...</div>
    )
  }

  if (error) {
    return (<div css={containerStyle}>This went wrong: ${error.message}</div>)
  }

  if (requestComplete && data) {
    const {start, end, status, id} = data.startNap;
    return (
      <div css={containerStyle}>
        <h1 css={titleStyle}>Dutje is toegevoegd</h1>
        <div>{moment(start).format("dd/MM HH:mm")} - {moment(end).format("HH/mm")}</div>
        <div>status: {status}</div>
        <div>{id}</div>
        <Button onClick={() => setRequestComplete(false)}>ok</Button>
      </div>
    )
  }

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>Dutje toevoegen</h1> 
    <TimeRangePicker handleSubmit={times => {
      addNapEvent({variables: {
        babyId: BABY_ID, 
        start: times.startTime.format(),
        end: times.endTime.format(),
    }})
    }} />
    </div>
  )
}

export default AddNapEvent;

export const CREATE_NAP_EVENT_QUERY = gql`
  mutation createNapEvent($babyId: ID!, $start: String!, $end: String) {
    startNap(babyId: $babyId, start: $start, end: $end) {
      id
      start
      end
      status
    }
  }
`

