import React from 'react'
import EventListItem from './EventListItem';




const EventListContainer = ({events, isVisible, refetch}) => {
    if (!isVisible) return null;
    const sortedEvents = [...events].sort((a, b) => new Date(b.start) - new Date(a.start))
    console.log(events, sortedEvents)
    return (
        <div>
        {
            sortedEvents.map(event => {
                return (
                    <EventListItem key={event.id} event={event} refetch={refetch} />
                )
            })
        }
    </div>
    )
}

export default EventListContainer;
