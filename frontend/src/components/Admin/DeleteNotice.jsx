import React, { useState, useEffect } from "react";
import '@styles/DeleteNotice.css';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/notices/all";

const DeleteNotice = () => {
  const [notices, setNotices] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleDeleteClick = (notice) => {
    setNoticeToDelete(notice); // Save the notice to delete
    setShowConfirmModal(true);  // Show the confirmation modal
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);  // Close the modal
    setNoticeToDelete(null);      // Clear the notice to delete
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notices/${noticeToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted notice from the list
        setNotices(notices.filter((notice) => notice.id !== noticeToDelete.id));
        handleCloseModal();  // Close the modal
      } else {
        console.error("Failed to delete notice");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this notice?</h2>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCloseModal}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteNotice;
