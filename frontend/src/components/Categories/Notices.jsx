import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@styles/Notices.css';
import headerImage from '@assets/Acadia_Notices.jpg';

const Notices = () => {
    // State to store all notices fetched from the API
    const [notices, setNotices] = useState([]);
    
    // State to store the categories for filtering notices
    const [categories, setCategories] = useState([]);
    
    // State to track the selected category for filtering notices
    const [selectedCategory, setSelectedCategory] = useState("");  // Default: No category selected

    // useEffect hook to fetch categories and notices when the component mounts
    useEffect(() => {
        // Fetch all categories from the API to populate the category dropdown
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
            .then((res) => setCategories(res.data)) // Set categories in state
            .catch((err) => console.error("Error fetching categories:", err));

        // Fetch notices (default: all)
        fetchNotices();
    }, []);  // Empty dependency array to run this effect only once when the component mounts

    // Function to fetch notices, with an optional categoryId filter
    const fetchNotices = (categoryId = "") => {
        let url = `${import.meta.env.VITE_API_URL}/api/notices/all`; // Default: Get all notices
        if (categoryId) {
            url = `${import.meta.env.VITE_API_URL}/api/notices/categories/${categoryId}`; // Append category filter if a category is selected
        }

        // Make the API call to fetch notices
        axios.get(url)
            .then((res) => {
                console.log("Filtered Notices:", res.data);
                setNotices(res.data); // Set the fetched notices in state
            })
            .catch((err) => console.error("Error fetching notices:", err));
    };

    // Function to handle category selection and fetch filtered notices
    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId); // Update the selected category in state
        fetchNotices(categoryId); // Fetch notices for the selected category
    };

    return (
        <div className="notices-page">
            <h2 className="notices-heading">Notices</h2>

            {/* Dropdown for category selection */}
            <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
                <option value="">All Categories</option> {/* Default option: All categories */}
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name} {/* Display category name */}
                    </option>
                ))}
            </select>

            {/* Display Notices */}
            <ul className="notices-list">
                {notices.length > 0 ? (
                    notices.map((notice) => (
                        <button className='notice-button' onClick={() => window.location.href = `/notices/${notice.id}`} key={notice.id}>
                            <li key={notice.id} className="notice-item">
                                <h3 className="notice-title">{notice.title}</h3>
                                <p className="notice-description">{notice.description}</p>
                                {/* Link to view detailed notice */}
                            </li>
                        </button>
                    ))
                ) : (
                    <p className="no-notices-message">No notices found.</p> // Message when no notices are available
                )}
            </ul>
        </div>
    );
};

export default Notices;
