import React, { useState, useEffect } from "react";
import '@styles/DeleteEvent.css';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/events/all";

const DeleteEvent = () => {
  const [events, setEvents] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event); // Save the event to delete
    setShowConfirmModal(true);  // Show the confirmation modal
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);  // Close the modal
    setEventToDelete(null);      // Clear the event to delete
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted event from the list
        setEvents(events.filter((event) => event.id !== eventToDelete.id));
        handleCloseModal();  // Close the modal
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
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
