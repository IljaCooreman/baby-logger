import React from 'react'
import EventListItem from './EventListItem';




const EventListContainer = ({events, isVisible, refetch}) => {
    if (!isVisible) return null;
    return (
        <div>
        {
            events.map(event => {
                return (
                    <EventListItem key={event.id} event={event} refetch={refetch} />
                )
            })
        }
    </div>
    )
}

export default EventListContainer;
