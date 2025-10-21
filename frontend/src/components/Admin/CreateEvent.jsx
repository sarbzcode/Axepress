// Import necessary dependencies
import React, { useEffect, useState } from 'react'; // React hooks for managing state and side effects
import axios from 'axios'; // Axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes
import '@styles/CreateEvent.css'; // Importing the CSS file for styling

const CreateEvent = ({ onEventAdded }) => {
    // State variables to store the form data and other states
    const [title, setTitle] = useState(''); // Event title
    const [description, setDescription] = useState(''); // Event description
    const [place, setPlace] = useState(''); // Event place
    const [date, setDate] = useState(''); // Event date
    const [time, setTime] = useState(''); // Event time
    const [categoryId, setCategoryId] = useState(''); // Selected category ID
    const [categories, setCategories] = useState([]); // List of event categories
    const [loading, setLoading] = useState(false); // Loading state to manage form submission

    const navigate = useNavigate(); // Hook to navigate programmatically
    const [isLoggedIn, setIsLoggedIn] = useState(true); // State to track login status

    // Check login status when the component mounts
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Send request to check if the user is logged in
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/admindashboard`, { withCredentials: true });
            } catch (error) {
                console.error('User not logged in:', error);
                setIsLoggedIn(false); // Set login status to false if the user is not logged in
                navigate('/login'); // Redirect to login page
            }
        };
        checkLoginStatus(); // Call the function to check login status
    }, [navigate]);

    // Fetch available event categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch categories from the server
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(response.data); // Update categories state with the fetched data
            } catch (error) {
                console.error('Error fetching categories:', error); // Log any error
            }
        };
        fetchCategories(); // Fetch categories on component mount
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Set loading state to true while submitting the form

        // Validate form fields
        if (!title.trim() || !description.trim() || !place.trim() || !time || !date) {
            alert('All fields must be filled!');
            setLoading(false); // Stop loading if validation fails
            return;
        }

        // Check if a valid category is selected
        if (!categoryId) {
            alert('Invalid category selection!');
            setLoading(false); // Stop loading if no category is selected
            return;
        }

        try {
            // Prepare the event data to be sent in the request
            const eventData = {
                title,
                description,
                place,
                date,
                time,
                category_id: categoryId,
            };

            console.log('Event Data:', eventData); // Log event data for debugging
    
            // Make a POST request to create the event
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, eventData);
            console.log("Event created successfully:", response.data);
    
            // Call the onEventAdded callback passed as a prop
            if (onEventAdded) {
                onEventAdded(response.data);
            }
    
            // Clear form fields after successful submission
            setTitle("");
            setDescription("");
            setDate("");
            setPlace("");
            setTime("");
            setLoading(false); // Stop loading
        } catch (err) {
            console.error('Error creating event:', err.response?.data || err.message); // Log any error
            alert(err.response?.data?.error || "Failed to create event"); // Show error message
            setLoading(false); // Stop loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-event-form">
            <div className="form-header">
                <h2>Create Event</h2>
                <p className="form-description">Organize a new event by providing key details below.</p>
            </div>
            {/* Event Title */}
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            </div>
            {/* Event Description */}
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
            </div>
            {/* Event Place */}
            <div className="form-group">
                <label htmlFor="place">Place:</label>
                <input id="place" type="text" value={place} onChange={(e) => setPlace(e.target.value)} disabled={loading} />
            </div>
            {/* Event Date */}
            <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading} />
            </div>
            {/* Event Time */}
            <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={loading} />
            </div>
            {/* Event Category */}
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
            {/* Submit Button */}
            <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </div>
        </form>
    );
};

export default CreateEvent;
