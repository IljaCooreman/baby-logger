/** @jsx jsx */

import {css, jsx} from '@emotion/core'
import moment from 'moment'

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
    return (
        <div css={containerStyle}>
            <div>

            {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
            </div>
             <div>

             {Math.ceil(event.duration / 60)}minutes
             </div>
        </div>
    )
}

export default EventListItem;

