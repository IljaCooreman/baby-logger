import React from 'react'
import EventListItem from './EventListItem';




const EventListContainer = ({events, isVisible}) => {
    if (!isVisible) return null;
    return (
        <div>
        {
            events.map(event => {
                return (
                    <EventListItem key={event.key} event={event} />
                )
            })
        }
    </div>
    )
}

export default EventListContainer;
