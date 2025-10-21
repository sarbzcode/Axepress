import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@styles/Events.css';

const Events = () => {
    // State to store the list of events
    const [events, setEvents] = useState([]);
    
    // State to store the categories (e.g., different event types)
    const [categories, setCategories] = useState([]);
    
    // State to keep track of the selected category (default is no category selected)
    const [selectedCategory, setSelectedCategory] = useState("");

    // Fetch categories and events when the component is mounted
    useEffect(() => {
        // Fetch all categories from the API
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
            .then((res) => setCategories(res.data)) // Set categories in state
            .catch((err) => console.error("Error fetching categories:", err)); // Log error if fetching fails

        // Fetch events (default: all events)
        fetchEvents(); // Call function to fetch all events initially
    }, []); // Empty dependency array means this runs once when the component mounts

    // Function to fetch events, optionally filtered by category
    const fetchEvents = (categoryId = "") => {
        let url = `${import.meta.env.VITE_API_URL}/api/events/all`; // Default to fetching all events
        if (categoryId) {
            // If a category is selected, fetch events filtered by that category
            url = `${import.meta.env.VITE_API_URL}/api/events/categories/${categoryId}`;
        }

        // Make API request to fetch events
        axios.get(url)
            .then((res) => {
                console.log("Filtered Events:", res.data); // Log the fetched events (for debugging)
                setEvents(res.data); // Set the fetched events in state
            })
            .catch((err) => console.error("Error fetching events:", err)); // Log error if fetching fails
    };

    // Function to handle category selection change
    const handleCategoryChange = (event) => {
        const categoryId = event.target.value; // Get selected category ID
        setSelectedCategory(categoryId); // Update the selected category in state
        fetchEvents(categoryId); // Fetch events for the selected category
    };

    return (
        <div className="events-page">
            {/* Header with an image */}
            <header className='header'>
                <img src={headerImage} alt='Acadia theatre' className='header-image' />
            </header>

            {/* Events page heading */}
            <h2 className="events-heading">Events</h2>

            {/* Dropdown menu to select event category */}
            <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
                <option value="">All Categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            {/* Display list of events */}
            <ul className="events-list">
                {events.length > 0 ? (
                    // If events are found, display them in a list
                    events.map((event) => (
                        <li key={event.id} className="event-item">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">{event.description}</p>
                            {/* Link to view event details */}
                            <Link to={`/events/${event.id}`} className="event-link">View Details</Link>
                        </li>
                    ))
                ) : (
                    // Display message if no events are found
                    <p className="no-events-message">No events found.</p>
                )}
            </ul>
        </div>
    );
};

export default Events;
