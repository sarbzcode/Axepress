import React, { useState, useEffect } from "react";
import '@styles/DeleteNotice.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes

// API endpoint to fetch all notices
const API_URL = "http://localhost:5000/api/notices/all";

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
        const response = await axios.get('http://localhost:5000/api/auth/admindashboard', { withCredentials: true });
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
      const response = await fetch(`http://localhost:5000/api/notices/${noticeToDelete.id}`, {
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
    <div className="notice-container">
      <h1>All Notices</h1>
      <div className="notice-list">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-card">
            <h3>{notice.title}</h3>
            <p>{notice.description}</p>
            <button className="delete-button" onClick={() => handleDeleteClick(notice)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal to confirm deletion */}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this notice?</h2>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Yes</button> {/* Confirm deletion */}
              <button onClick={handleCloseModal}>No</button> {/* Cancel deletion */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteNotice;