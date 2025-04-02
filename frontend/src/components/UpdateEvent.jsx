import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Categories from './Categories';

const UpdateEvent = ({ eventId, onEventUpdated }) => {
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        place: '',
        date: '',
        time: '',
        category_id: '',
        value_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [valueId, setValueId] = useState('');


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
                setEventData(response.data);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to load event data');
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`http://localhost:5000/api/events/${eventId}`, eventData);
            console.log("Event updated successfully");

            if (onEventUpdated) {
                onEventUpdated(eventData);
            }
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Failed to update event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={eventData.title} onChange={handleChange} disabled={loading} />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={eventData.description} onChange={handleChange} disabled={loading} />
            </div>
            <div>
                <label>Place:</label>
                <input type="text" name="place" value={eventData.place} onChange={handleChange} disabled={loading} />
            </div>
            <div>
                <label>Date:</label>
                <input type="date" name="date" value={eventData.date} onChange={handleChange} disabled={loading} />
            </div>
            <div>
                <label>Time:</label>
                <input type="time" name="time" value={eventData.time} onChange={handleChange} disabled={loading} />
            </div>

            { <Categories setCategoryId={setCategoryId} setValueId={setValueId} /> }

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Event"}
            </button>
        </form>
    );
};

export default UpdateEvent;
