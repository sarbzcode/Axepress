//React - to use .jsx features
//useEffect - runs effects like fetching data after component mounts
//useState - managing state within component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@styles/Notices.css';
import headerImage from '@assets/Acadia_Notices.jpg'

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");  // Default: No category selected

    useEffect(() => {
        // Fetch all categories
        axios.get("http://localhost:5000/api/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error fetching categories:", err));

        // Fetch notices (default: all)
        fetchNotices();
    }, []);

    const fetchNotices = (categoryId = "") => {
        let url = "http://localhost:5000/api/notices/all"; // Get all notices
        if (categoryId) {
            url = `http://localhost:5000/api/notices/categories/${categoryId}`; // Append category filter if selected
        }

        axios.get(url)
            .then((res) => {
                console.log("Filtered Notices:", res.data);
                setNotices(res.data);
            })
            .catch((err) => console.error("Error fetching notices:", err));
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId); // Update state
        fetchNotices(categoryId); // Fetch notices for selected category
    };

    return (
        <div className="notices-page">
            <header className='header'>
                <img src={headerImage} alt='Acadia UHall' className='header-image'/>
            </header>
        <h2 className="notices-heading">Notices</h2>

        {/* Dropdown for category selection */}
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
            <option value="">All Categories</option>
            {categories.map((category) => (
            <option key={category.id} value={category.id}>
                {category.name}
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
                </li>
            ))
            ) : (
            <p className="no-notices-message">No notices found.</p>
            )}
        </ul>
        </div>
            );
};

export default Notices;
