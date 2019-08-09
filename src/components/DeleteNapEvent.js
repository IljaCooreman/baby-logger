/** @jsx jsx */
import {useState} from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';
import {css, jsx} from '@emotion/core'
import { Modal } from 'antd';

const { confirm } = Modal;


const containerStyle = css`
  display: flex;
  flex-grow: 1;
  justify-content: center;
`


const deleteLinkStyle = css`
color: #FF391E;
    font-size: 12px;
    align-self: center;
    margin-top: 22px;

`;


const DeleteNapEvent = ({id, refetch}) => {
  const [requestComplete, setRequestComplete] = useState(true)
  const [deleteNapEvent, { loading, error, data }] = useMutation(DELETE_NAP_EVENT, 
    {
      onCompleted() {
          setRequestComplete(true);
          refetch();
      }
    }
  );

  if (loading) {
    return (
      <div css={containerStyle}>Gegevens doorsturen...</div>
    )
  }

  if (error) {
    return (<div css={containerStyle}>Er ging iets fout: ${error.message}</div>)
  }


  function showDeleteConfirm() {
    confirm({
      title: 'Ben je zeker dat je dit dutje wil verwijderen?',
      content: 'Deze actie is onomkeerbaar',
      okText: 'Ja',
      okType: 'danger',
      cancelText: 'Nee',
      onOk() {
        deleteNapEvent({variables: {
            id
        }})
      }
    });
  }

  return (
      <div css={deleteLinkStyle} onClick={showDeleteConfirm}>Verwijder dutje</div>
  )
}

export default DeleteNapEvent;

export const DELETE_NAP_EVENT = gql`
  mutation deleteNapEvent($id: ID!) {
    deleteNapEvent(id: $id ) {
      id
      start
      end
      status
    }
  }
`

