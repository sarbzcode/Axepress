import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/UpdateNotice.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/notices/all`;
const CATEGORY_API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

const UpdateNotice = () => {
  const [notices, setNotices] = useState([]); // State to store the list of notices
  const [categories, setCategories] = useState([]); // State to store categories for the notice
  const [selectedNotice, setSelectedNotice] = useState(null); // State to store the selected notice for editing
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to check if user is logged in

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/admindashboard`, {withCredentials: true});
      } catch (error) {
        console.error('User not logged in:', error);
        setIsLoggedIn(false); // Set login state to false if not logged in
        navigate('/login'); // Redirect to login page if not logged in
      }
    };
    checkLoginStatus();
  }, [navigate]);

  // Fetch notices and categories when the component mounts
  useEffect(() => {
    fetchNotices();
    fetchCategories();
  }, []);

  // Function to fetch notices from the API
  const fetchNotices = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotices(data); // Store the fetched notices in the state
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // Function to fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API_URL);
      const data = await response.json();
      setCategories(data); // Store the fetched categories in the state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to set the selected notice for editing
  const handleEditClick = (notice) => {
    setSelectedNotice(notice); // Set the selected notice in the state for editing
  };

  // Function to close the modal without saving changes
  const handleCloseModal = () => {
    setSelectedNotice(null); // Clear the selected notice
  };

  // Function to save the updated notice
  const handleSave = async () => {
    try {
      const updatedNotice = {
        title: selectedNotice.title,
        description: selectedNotice.description,
        category_id: selectedNotice.category_id,
      };

      // Send the updated notice to the API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notices/${selectedNotice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNotice), // Send the updated notice data in the request body
      });

      if (response.ok) {
        fetchNotices(); // Re-fetch notices after update
        handleCloseModal(); // Close the modal
      } else {
        console.error("Failed to update notice");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
    }
  };

  return (
    <section className="notice-container">
      <header className="notice-header">
        <h1>Update Notices</h1>
        <p>Review the latest notices and refine their details before they go live.</p>
      </header>
      {notices.length === 0 ? (
        <div className="notice-empty-state">
          <p>No notices available right now. Create a new notice to get started.</p>
        </div>
      ) : (
        <div className="notice-list">
          {notices.map((notice) => (
            <article key={notice.id} className="notice-card">
              <h3 className="notice-card__title">{notice.title}</h3>
              <p className="notice-card__description">{notice.description || 'No description provided yet.'}</p>
              <div className="notice-card__actions">
                <button className="edit-button" onClick={() => handleEditClick(notice)}>
                  Edit Notice
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedNotice && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="editNoticeTitle">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="editNoticeTitle">Edit Notice</h2>
              <p>Adjust the content and category before saving your changes.</p>
            </div>
            <label htmlFor="edit-notice-title">Title</label>
            <input
              id="edit-notice-title"
              type="text"
              value={selectedNotice.title}
              onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })}
            />
            <label htmlFor="edit-notice-category">Category</label>
            <select
              id="edit-notice-category"
              value={selectedNotice.category_id}
              onChange={(e) => setSelectedNotice({ ...selectedNotice, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label htmlFor="edit-notice-description">Description</label>
            <textarea
              id="edit-notice-description"
              value={selectedNotice.description}
              onChange={(e) => setSelectedNotice({ ...selectedNotice, description: e.target.value })}
            ></textarea>
            <div className="modal-buttons">
              <button className="modal-button save" onClick={handleSave}>Save Changes</button>
              <button className="modal-button cancel" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpdateNotice;
