import React, { useState, useEffect } from "react"; // Import React and hooks
import '@styles/DeleteEvent.css'; // Import the CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes

// Define the API URL for fetching events
const API_URL = "http://localhost:5000/api/events/all";

const DeleteEvent = () => {
  // State variables for managing events, the modal, and the selected event to delete
  const [events, setEvents] = useState([]); // Store the list of events
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Track if the confirmation modal is shown
  const [eventToDelete, setEventToDelete] = useState(null); // Store the event selected for deletion
  const navigate = useNavigate(); // Hook to programmatically navigate between pages
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to check if the user is logged in

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

  // Fetch events from the backend when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []); // Empty dependency array means this effect runs once when the component is mounted

  // Function to fetch all events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL); // Fetch events from the backend
      const data = await response.json(); // Convert the response to JSON
      setEvents(data); // Set the fetched events in state
    } catch (error) {
      console.error("Error fetching events:", error); // Log any error during fetching
    }
  };

  // Function to handle the delete button click
  const handleDeleteClick = (event) => {
    setEventToDelete(event); // Set the event to be deleted
    setShowConfirmModal(true); // Show the confirmation modal
  };

  // Function to close the confirmation modal
  const handleCloseModal = () => {
    setShowConfirmModal(false); // Hide the modal
    setEventToDelete(null); // Clear the event to delete
  };

  // Function to confirm the deletion of an event
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventToDelete.id}`, {
        method: "DELETE", // Use DELETE HTTP method to remove the event
      });

      if (response.ok) {
        // If the delete was successful, remove the deleted event from the list
        setEvents(events.filter((event) => event.id !== eventToDelete.id));
        handleCloseModal(); // Close the confirmation modal
      } else {
        console.error("Failed to delete event"); // Log an error if the deletion failed
      }
    } catch (error) {
      console.error("Error deleting event:", error); // Log any error during deletion
    }
  };

  return (
    <div className="event-container">
      <h1>All Events</h1>
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <button className="delete-button" onClick={() => handleDeleteClick(event)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this event?</h2>
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

export default DeleteEvent;