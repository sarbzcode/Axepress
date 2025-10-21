import React, { useState, useEffect } from "react"; // Import React and hooks
import '@styles/DeleteEvent.css'; // Import the CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes

// Define the API URL for fetching events
const API_URL = `${import.meta.env.VITE_API_URL}/api/events/all`;

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/admindashboard`, { withCredentials: true });
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventToDelete.id}`, {
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
    <section className="event-container">
      <header className="event-header">
        <h1>Delete Events</h1>
        <p>Remove events that are no longer relevant or have been cancelled.</p>
      </header>
      {events.length === 0 ? (
        <div className="event-empty-state">
          <p>No events are scheduled right now. Create one to manage it from here.</p>
        </div>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <article key={event.id} className="event-card">
              <div className="event-card__header">
                <h3 className="event-card__title">{event.title}</h3>
                <p className="event-card__meta">
                  <span>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span>
                  <span>{event.time || 'N/A'}</span>
                  <span>{event.place || 'N/A'}</span>
                </p>
              </div>
              <p className="event-card__description">{event.description || 'No description available yet.'}</p>
              <div className="event-card__actions">
                <button className="delete-button" onClick={() => handleDeleteClick(event)}>
                  Delete Event
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showConfirmModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="deleteEventTitle">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="deleteEventTitle">Delete Event</h2>
              <p>This event will be permanently removed from the calendar.</p>
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

export default DeleteEvent;
