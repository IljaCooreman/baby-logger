/** @jsx jsx */

import {css, jsx} from '@emotion/core'
import moment from 'moment'
import { Button } from 'antd';
import { useState } from 'react';
import UpdateNapEvent from './UpdateNapEvent';

const containerStyle = css`
    border-radius: 6px;
    background-color: #E1E7FD;
    width: 100%;
    padding: 12px;
    margin: 6px 0;
    display: flex;
    justify-content: space-around;
    `;


const EventListItem = ({event}) => {
    const [isEditing, setIsEditing] = useState(false);
    if (isEditing) return (
        <div css={containerStyle} onClick={e => e.stopPropagation()}>
            <UpdateNapEvent {...event} />

            <Button 
            shape="circle" 
            icon="close"
            onClick={
                (e) => {
                    e.preventDefault(); 
                    setIsEditing(false)
                }
            } />
        </div>
    );
    return (
        <div css={containerStyle} onClick={e => e.stopPropagation()}>
            <div>
            {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
            </div>
             <div>
             {Math.ceil(event.duration / 60)}m
             </div>
             <Button onClick={
                (e) => {
                    e.preventDefault(); 
                    setIsEditing(true);
                }}>Edit</Button>
        </div>
    )
}

export default EventListItem;

