import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@styles/CreateEvent.css';

const CreateEvent = ({ onEventAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/auth/admindashboard', {withCredentials: true});
          } catch (error) {
            console.error('User not logged in:', error);
            setIsLoggedIn(false);
            navigate('/login');
          }
        };
        checkLoginStatus();
      }, [navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error){
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!title.trim() || !description.trim() || !place.trim() || !time || !date) {
            alert('All fields must be filled!');
            setLoading(false);
            return;
        }
    
        if (!categoryId) {
            alert('Invalid category selection!');
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
        <form onSubmit={handleSubmit} className="create-event-form">
            <div className="form-header">
                <h2>Create an Event!</h2>
            </div>
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
                <label htmlFor="place">Place:</label>
                <input id="place" type="text" value={place} onChange={(e) => setPlace(e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={loading}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" disabled={loading} className="submit-button">{loading ? "Creating..." : "Create Event"}</button>
            </form>
    );
};

export default CreateEvent;