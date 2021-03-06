/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import moment from 'moment'
import { Button } from 'antd';
import { useState } from 'react';
import UpdateNapEvent from './UpdateNapEvent';
import DeleteNapEvent from './DeleteNapEvent';
import { secondsToHoursMinutes } from '../helpers/secondsToHoursMinutes';

const containerStyle = (status) => css`
    border-radius: 6px;
    background-color: ${status === "ONGOING" ? "#FFE4CB" : "#E1E7FD"};
    border: ${status === "INCOMPLETE" ? "1px dotted #5175F1" : "none"};
    width: 100%;
    padding: 12px;
    margin: 6px 0;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    `;

const containerEditStyle = css`
    position: relative;
    border-radius: 6px;
    background-color: #E1E7FD;
    width: 100%;
    padding: 12px;
    margin: 6px 0;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    `;

const closeButtonStyle = css`
        position: absolute;
        top: 8px;
        right: 8px;
    `


const EventListItem = ({ event, refetch }) => {
    const [isEditing, setIsEditing] = useState(false);
    const duration = secondsToHoursMinutes(event.duration);
    if (isEditing) return (
        <div css={containerEditStyle} onClick={e => e.stopPropagation()}>
            <UpdateNapEvent {...event} />
            <DeleteNapEvent {...event} refetch={refetch} />

            <Button
                css={closeButtonStyle}
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
        <div css={() => containerStyle(event.status)} onClick={e => e.stopPropagation()}>
            <div css={css`display: flex; flex-flow: column;`}>
                <div css={css`
                    font-weight: bold;
                    text-transform: capitalize;
                    justify-content: center;
                    `}>{event.slot}</div>
                <div>
                    <div>
                        {moment(event.start).format("HH:mm")} - {event.end ? moment(event.end).format("HH:mm") : "nu"}
                    </div>
                </div>
            </div>
            <div css={css`display: flex; flex-flow: column;`}>
                <div style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                }}>
                    {duration.hours > 0 && `${duration.hours}u`} {duration.minutes}m
            </div>
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

