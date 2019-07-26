import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import moment from 'moment'

export default class Today extends Component {
  render() {
    return (
      <Query query={NAPEVENTS_QUERY}>
        {({ data, loading, error, refetch }) => {
          console.log(data)
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

          return (
            <Fragment>
              <h1>all events</h1>
              {data.napEvents &&
                data.napEvents.map(nap => (
                  <div key={nap.id}>{moment(nap.start).format("HH:mm")} - {moment(nap.end).format("HH:mm")} duration: {Math.ceil(nap.duration / 60)} minutes status: {nap.status}</div>
                ))}
              {this.props.children}
              <br>
              </br>
              <div>total: {Math.floor(data.napEvents.reduce((acc, nap) => {
                return acc + nap.duration
              }, 0) / 60)} minutes</div>
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const NAPEVENTS_QUERY = gql`
  query NapEventsQuery {
    napEvents {
      id
      start
      end
      status
      duration
    }
  }
`
