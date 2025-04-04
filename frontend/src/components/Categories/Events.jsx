//React - to use .jsx features
//useEffect - runs effects like fetching data after component mounts
//useState - managing state within component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@styles/Events.css';
import headerImage from '@assets/Acadia_Events.jpg'

const Events = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");  // Default: No category selected

    useEffect(() => {
        // Fetch all categories
        axios.get("http://localhost:5000/api/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error fetching categories:", err));

        // Fetch events (default: all)
        fetchEvents();
    }, []);

    const fetchEvents = (categoryId = "") => {
        let url = "http://localhost:5000/api/events/all"; // Get all events
        if (categoryId) {
            url = `http://localhost:5000/api/events/categories/${categoryId}`; // Append category filter if selected
        }

        axios.get(url)
            .then((res) => {
                console.log("Filtered Events:", res.data);
                setEvents(res.data);
            })
            .catch((err) => console.error("Error fetching events:", err));
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId); // Update state
        fetchEvents(categoryId); // Fetch events for selected category
    };

    return (
        <div className="events-page">
            <header className='header'>
                <img src={headerImage} alt='Acadia theatre' className='header-image'/>
            </header>
            <h2 className="events-heading">Events</h2>

            {/* Dropdown for category selection */}
            <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
                <option value="">All Categories</option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
                ))}
            </select>

            {/* Display Events */}
            <ul className="events-list">
                {events.length > 0 ? (
                events.map((event) => (
                    <li key={event.id} className="event-item">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <Link to={`/events/${event.id}`} className="event-link">View Details</Link>
                    </li>
                ))
                ) : (
                <p className="no-events-message">No events found.</p>
                )}
            </ul>
        </div>

    );
};

export default Events;