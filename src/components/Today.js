import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import moment from 'moment'
import { BABY_ID } from '../constants/variables';
import DayOverviewGraph from './DayOverviewGraph';
import { groupEventsByDay } from '../helpers/groupEventsByDay';

export default class Today extends Component {
  render() {
    return (
      <Query query={NAPEVENTS_QUERY} variables={{
          babyId: BABY_ID, 
          // before: moment().endOf('week').toISOString(),
          // after: moment().startOf('week').toISOString()
        }}>
        {({ data, loading, error, refetch }) => {
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

          const groupedEvents = groupEventsByDay(data.napEvents);

          return (
            <Fragment>
              <h1>Overzicht</h1>
              {
                Object.keys(groupedEvents).sort((a, b) => new Date(b) - new Date(a)).map(key => {
                  return <DayOverviewGraph key={key} events={groupedEvents[key]} date={key} />
                })
              }
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const NAPEVENTS_QUERY = gql`
  query NapEventsQuery($babyId: ID!, $before: String, $after: String) {
    napEvents (babyId: $babyId, before: $before, after: $after) {
      id
      start
      end
      status
      duration
    }
  }
`
