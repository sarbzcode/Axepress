import React, { useState } from 'react';
import axios from 'axios';
import Categories from './Categories';

const CreateEvent = ({ onEventAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [valueId, setValueId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Log the values to check if they are set correctly
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Category ID:", categoryId);
        console.log("Value ID:", valueId);
    
        if (!title.trim() || !description.trim() || !place.trim() || !time || !date) {
            alert('All fields must be filled!');
            setLoading(false);
            return;
        }
    
        if (!categoryId || !valueId) {
            alert('Invalid category or value selection!');
            setLoading(false);
            return;
        }
    
        try {
            const eventData = {
                title,
                description,
                place,
                date,
                time,
                category_id: categoryId,
                value_id: valueId,
            };

            console.log('Event Data:', eventData);
    
            const response = await axios.post("http://localhost:5000/api/events", eventData);
            console.log("Event created successfully:", response.data);
    
            if (onEventAdded) {
                onEventAdded(response.data);
            }
    
            setTitle("");
            setDescription("");
            setDate("");
            setPlace("");
            setTime("");
            setLoading(false);
        } catch (err) {
            console.error('Error creating event:', err.response?.data || err.message);
            alert(err.response?.data?.error || "Failed to create event");
            setLoading(false);
        } 
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
            <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
            </div>
            <div>
                <label>Place:</label>
                <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} disabled={loading} />
            </div>
            <div>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading} />
            </div>
            <div>
                <label>Time:</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={loading} />
            </div>
            {/* Corrected prop names */}
            <Categories setCategoryFilter={setCategoryId} setValueFilter={setValueId} />
            <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Event"}</button>
        </form>
    );
};

export default CreateEvent;