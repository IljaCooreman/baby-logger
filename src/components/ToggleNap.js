/** @jsx jsx */
import {useState} from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { BABY_ID } from '../constants/variables';
import { useMutation } from '@apollo/react-hooks';

import {css, jsx} from '@emotion/core'

const buttonStyle = (active, loading) => css`
  padding: 30px 20px; 
  min-height: 2;
  box-shadow: 0px 3px 10px rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${active ? '#FF8A1E' : "white"};
  transform: scale(${loading  ? .6 : 1});
  border-radius: ${loading  ? 20 : 10}px;
  color: ${active ?  "white" : "#536ECD"};
  transition: all .2s;
  font-size: 20px;
  font-weight: bold;
`

const containerStyle = css`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
`

const subtextStyle = css`
color: white;
margin: 16px;
`



const ToggleNap = () => {
  const [status, setStatus] = useState("INCOMPLETE");
  const [toggleNap, { loading: mutationLoading, error: mutationError, data: mutationData, called: mutationCalled }] = useMutation(TOGGLE_NAP_QUERY, 
    {
      onCompleted({toggleNap}) {
        setStatus(toggleNap.status)
      }
    }
  );


  const handleClick =  e => {
    e.preventDefault();
    toggleNap({variables: {babyId: BABY_ID}})
  };

    return (
      <Query query={STATUS_QUERY} variables={{babyId: BABY_ID}}>
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
          const firstStatus = data.napEvents[0] ? data.napEvents[0].status : "INCOMPLETE"
          const babyName = data.napEvents[0].baby.name;
          const buttonText = status === "ONGOING" ? "stop nap" : "start nap";
          if (!mutationCalled) setStatus(firstStatus)
          return (
              <div css={containerStyle}> 
                <div css={subtextStyle}>{status === "ONGOING" ? `${babyName} doet nu een dutje` : `${babyName} is wakker`}</div>
                <div css={buttonStyle(status === "ONGOING", mutationLoading)} onClick={handleClick}>
                  {mutationLoading && "Loading"}
                  {mutationError && mutationError.message}
                  {!mutationLoading && !mutationError && buttonText}
                </div>
              </div>
          )
        }}
      </Query>
    )
}

export default ToggleNap;

export const STATUS_QUERY = gql`
  query napEvents($babyId: ID!) {
    napEvents(babyId: $babyId, last: 1) {
      status
      baby {
        name
      }
    }
  }
`

const TOGGLE_NAP_QUERY= gql`
  mutation toggleNap($babyId: ID!) {
    toggleNap(babyId: $babyId) {
      id
      status
    }
  }
`;

