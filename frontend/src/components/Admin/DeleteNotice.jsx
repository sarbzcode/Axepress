import React, { useState, useEffect } from "react";
import '@styles/DeleteNotice.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes

// API endpoint to fetch all notices
const API_URL = `${import.meta.env.VITE_API_URL}/api/notices/all`;

const DeleteNotice = () => {
  // State variables to manage notices, modal visibility, and the selected notice for deletion
  const [notices, setNotices] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to check if the user is logged in
  const navigate = useNavigate(); // Hook to programmatically navigate between pages

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

  // Fetch all notices when the component mounts
  useEffect(() => {
    fetchNotices();
  }, []);

  // Function to fetch all notices from the API
  const fetchNotices = async () => {
    try {
      const response = await fetch(API_URL); // Fetch data from the API
      const data = await response.json(); // Parse the response into JSON
      setNotices(data); // Store the fetched notices in the state
    } catch (error) {
      console.error("Error fetching notices:", error); // Log any error if fetching fails
    }
  };

  // Function to handle the click on the delete button
  const handleDeleteClick = (notice) => {
    setNoticeToDelete(notice); // Save the notice to be deleted
    setShowConfirmModal(true);  // Show the confirmation modal for deletion
  };

  // Function to close the confirmation modal
  const handleCloseModal = () => {
    setShowConfirmModal(false);  // Hide the modal
    setNoticeToDelete(null);      // Clear the selected notice
  };

  // Function to handle the deletion of the selected notice
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notices/${noticeToDelete.id}`, {
        method: "DELETE", // Send a DELETE request to the server
      });

      if (response.ok) {
        // If the deletion is successful, remove the notice from the state
        setNotices(notices.filter((notice) => notice.id !== noticeToDelete.id));
        handleCloseModal();  // Close the modal after deletion
      } else {
        console.error("Failed to delete notice"); // Log error if deletion fails
      }
    } catch (error) {
      console.error("Error deleting notice:", error); // Log any error during the deletion process
    }
  };

  return (
    <section className="notice-container">
      <header className="notice-header">
        <h1>Delete Notices</h1>
        <p>Remove outdated or inaccurate notices to keep your board current.</p>
      </header>
      {notices.length === 0 ? (
        <div className="notice-empty-state">
          <p>No notices are available to delete. Create a notice to see it listed here.</p>
        </div>
      ) : (
        <div className="notice-list">
          {notices.map((notice) => (
            <article key={notice.id} className="notice-card">
              <h3 className="notice-card__title">{notice.title}</h3>
              <p className="notice-card__description">{notice.description || 'No description provided yet.'}</p>
              <div className="notice-card__actions">
                <button className="delete-button" onClick={() => handleDeleteClick(notice)}>
                  Delete Notice
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showConfirmModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="deleteNoticeTitle">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="deleteNoticeTitle">Delete Notice</h2>
              <p>This action cannot be undone. Please confirm you would like to proceed.</p>
            </div>
            <div className="modal-buttons">
              <button className="modal-button danger" onClick={handleConfirmDelete}>Delete</button>
              <button className="modal-button cancel" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeleteNotice;
