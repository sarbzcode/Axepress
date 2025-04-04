import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/UpdateNotice.css';

const API_URL = "http://localhost:5000/api/notices/all";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const UpdatedNotice = () => {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/admindashboard', {withCredentials: true});
      } catch (error) {
        console.error('User not logged in:', error);
        setIsLoggedIn(false);
        navigate('/login');
      }
    };
    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    fetchNotices();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = (event) => {
    setSelectedNotice(event);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  const handleSave = async () => {
    try {
      const updatedNotice = {
        title: selectedNotice.title,
        description: selectedNotice.description,
        category_id: selectedNotice.category_id,
      };
      console.log(updatedNotice);

      const response = await fetch(`http://localhost:5000/api/notices/${selectedNotice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNotice),
      });

      if (response.ok) {
        fetchNotices();
        handleCloseModal();
      } else {
        console.error("Failed to update notice");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
    }
  };

  return (
    <div className="notice-container">
      <h1>All Notices</h1>
      <div className="notice-list">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-card">
            <h3>{notice.title}</h3>
            {/* Date and Time removed from display */}
            <p>{notice.description}</p>
            <button className="edit-button" onClick={() => handleEditClick(notice)}>Edit</button>
          </div>
        ))}
      </div>

      {selectedNotice && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Notice</h2>
            <label>Title:</label>
            <input
              type="text"
              value={selectedNotice.title}
              onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })}
            />
            <label>Category:</label>
            <select
              value={selectedNotice.category_id}
              onChange={(e) => setSelectedNotice({ ...selectedNotice, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label>Description:</label>
            <textarea
              value={selectedNotice.description}
              onChange={(e) => setSelectedNotice({ ...selectedNotice, description: e.target.value })}
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatedNotice;