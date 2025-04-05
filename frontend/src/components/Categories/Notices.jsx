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
        axios.get("http://localhost:5000/api/categories")
            .then((res) => setCategories(res.data)) // Set categories in state
            .catch((err) => console.error("Error fetching categories:", err));

        // Fetch notices (default: all)
        fetchNotices();
    }, []);  // Empty dependency array to run this effect only once when the component mounts

    // Function to fetch notices, with an optional categoryId filter
    const fetchNotices = (categoryId = "") => {
        let url = "http://localhost:5000/api/notices/all"; // Default: Get all notices
        if (categoryId) {
            url = `http://localhost:5000/api/notices/categories/${categoryId}`; // Append category filter if a category is selected
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
            <header className='header'>
                <img src={headerImage} alt='Acadia UHall' className='header-image' /> {/* Header image */}
            </header>
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
                        <li key={notice.id} className="notice-item">
                            <h3 className="notice-title">{notice.title}</h3>
                            <p className="notice-description">{notice.description}</p>
                            <Link to={`/notices/${notice.id}`} className="notice-link">View Details</Link>
                            {/* Link to view detailed notice */}
                        </li>
                    ))
                ) : (
                    <p className="no-notices-message">No notices found.</p> // Message when no notices are available
                )}
            </ul>
        </div>
    );
};

export default Notices;