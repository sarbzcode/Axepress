import React from 'react';
import axios from 'axios';

const DeleteEvent = ({ eventId, onEventDeleted }) => {
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}`);
            console.log("Event deleted successfully");

            if (onEventDeleted) {
                onEventDeleted(eventId);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return <button onClick={handleDelete}>Delete Event</button>;
};

export default DeleteEvent;
