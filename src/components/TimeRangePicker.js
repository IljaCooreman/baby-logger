/** @jsx jsx */
import {useState} from 'react'
import { gql } from 'apollo-boost'
import { DatePicker, Button } from 'antd';
import {css, jsx} from '@emotion/core';
import moment from 'moment'


const containerStyle = css`
  display: flex;
  flex-flow: column;
`




const TimeRangePicker = ({handleSubmit, start, end}) => {
    const [endTime, setEndTime] = useState(end)
    const [startTime, setStartTime] = useState(start)


          return (
              <div css={containerStyle}> 

                <DatePicker 
                    placeholder={"start"}
                    defaultValue={start}
                    showTime
                    onChange={(value, mode) => {
                        setStartTime(value)
                    }}
                    disabledDate={date => {
                      if (!endTime) return date.valueOf() > moment().valueOf();
                      return date.valueOf() > endTime.valueOf() || date.valueOf() > moment().valueOf()
                  }}
                    format="DD/MM HH:mm"
                />
                <DatePicker 
                    placeholder={"einde"}
                    defaultValue={end}
                    disabledDate={date => {
                      if (!startTime) return date.valueOf() > moment().valueOf();
                        return date.valueOf() < startTime.valueOf() || date.valueOf() > moment().valueOf()
                    }}
                    showTime
                    onChange={(value, mode) => {
                        setEndTime(value)
                    }}
                    format="DD/MM HH:mm"
                />

                <Button 
                disabled={!endTime && !startTime}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit({startTime, endTime})
                  }}>
                    Verstuur
                </Button>
              </div>
          )
}

export default TimeRangePicker;

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

