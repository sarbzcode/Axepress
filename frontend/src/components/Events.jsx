//React - to use .jsx features
//useEffect - runs effects like fetching data after component mounts
//useState - managing state within component
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { getEvents } from '../services/eventService';
import Categories from './Categories';
import '../styles/Events.css';

const Events = () => {
    //events - holds list of events
    //setEvents - update events state
    //initialize with empty array = no events initally loaded
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [valueFilter, setValueFilter] = useState('');

    //fetchEvents - async function, calls getEvents, waits for data and stores in events variable, updates setEvents with data
    useEffect(() => {
        async function fetchEvents() {
            try {
                const queryParams = [];
                if (categoryFilter) {
                    queryParams.push(`categoryId=${categoryFilter}`);
                }
                if (valueFilter) {
                    queryParams.push(`valueId=${valueFilter}`);
                }
                const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
                const response = await axios.get(`http://localhost:5000/api/events${queryString}`);
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, [categoryFilter, valueFilter]);

    const formatDateTime = (isoDate, timeString) => {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();

        const [hours, minutes] = timeString.split(":").map(Number);
        const localDate = new Date(year, month, day, hours, minutes);

        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        return {
            date: localDate.toLocaleDateString('en-US', dateOptions),
            time: localDate.toLocaleTimeString('en-US', timeOptions)
        };
    };

    //rendering notices
    return (
        <div>
            <Categories setCategoryFilter={setCategoryFilter} setValueFilter={setValueFilter} />
        <div className="events-container">
            <h2>Upcoming Events!</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                events.length > 0 ? (
                    <ul>
                    {events.map((event) => (
                        <li key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p><strong>Location:</strong> {event.place}</p>
                            {event.date && event.time && (
                        <>
                        <p><strong>Date: </strong>{formatDateTime(event.date, event.time).date}</p>
                        <p><strong>Time: </strong>{formatDateTime(event.date, event.time).time}</p>
                        </>
                    )}
                            <a className="details" href={`/events/${event.id}`}>View Details</a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found for the selected filters.</p>
                )
            )}
        </div>
    </div>
    );
};

export default Events;