// Import necessary dependencies
import React, { useEffect, useState } from 'react'; // React hooks for managing state and side effects
import axios from 'axios'; // Axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes
import '@styles/CreateNotice.css'; // Importing the CSS file for styling

const CreateNotice = ({ onNoticeAdded }) => {
    // State variables for form inputs and state management
    const [title, setTitle] = useState(''); // Notice title
    const [description, setDescription] = useState(''); // Notice description
    const [categoryId, setCategoryId] = useState(''); // Selected category ID
    const [categories, setCategories] = useState([]); // List of categories for dropdown
    const [loading, setLoading] = useState(false); // Loading state for submit button

    const navigate = useNavigate(); // Hook to programmatically navigate between pages
    const [isLoggedIn, setIsLoggedIn] = useState(true); // State to check if the user is logged in

    // Check if the user is logged in when the component mounts
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Send a request to check if the user is logged in
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/admindashboard`, { withCredentials: true });
            } catch (error) {
                console.error('User not logged in:', error);
                setIsLoggedIn(false); // Set login status to false if not logged in
                navigate('/login'); // Redirect to the login page if not logged in
            }
        };
        checkLoginStatus(); // Call the login check function when the component mounts
    }, [navigate]);

    // Fetch categories for the select dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch categories from the backend
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(response.data); // Update categories state with the fetched data
            } catch (error) {
                console.error('Error fetching categories:', error); // Log any error while fetching categories
            }
        };
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(true); // Set loading to true while processing the request
    
        // Validate form inputs to make sure fields are not empty
        if (!title.trim() || !description.trim()) {
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
            // Prepare the notice data to be sent in the request
            const noticeData = {
                title,
                description,
                category_id: categoryId,
            };

            console.log('Notice Data:', noticeData); // Log the notice data for debugging
    
            // Make a POST request to create a new notice
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, noticeData);
            console.log("Notice created successfully:", response.data);
    
            // If the onNoticeAdded callback is provided, call it with the created notice
            if (onNoticeAdded) {
                onNoticeAdded(response.data);
            }
    
            // Clear the form fields after successful submission
            setTitle("");
            setDescription("");
            setLoading(false); // Stop loading
        } catch (err) {
            console.error('Error creating notice:', err.response?.data || err.message); // Log any error during submission
            alert(err.response?.data?.error || "Failed to create notice"); // Show error message if any
            setLoading(false); // Stop loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-notice-form">
            <div className="form-header">
                <h2>Create Notice</h2>
                <p className="form-description">Use this form to publish a new notice for your community.</p>
            </div>
            {/* Form input for Notice Title */}
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            </div>
            {/* Form input for Notice Description */}
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
            </div>
            {/* Dropdown for selecting Notice Category */}
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
                    {loading ? "Creating..." : "Create Notice"}
                </button>
            </div>
        </form>
    );
};

export default CreateNotice;
