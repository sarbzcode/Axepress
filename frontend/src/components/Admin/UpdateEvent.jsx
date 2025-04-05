import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/UpdateEvent.css';

// API URLs for fetching events and categories
const API_URL = "http://localhost:5000/api/events/all";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const UpdateEvent = () => {
  // State variables for events, categories, the selected event for editing, and login status
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Effect to check if the user is logged in when the component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Make an API request to check if the user is logged in
        const response = await axios.get('http://localhost:5000/api/auth/admindashboard', { withCredentials: true });
      } catch (error) {
        console.error('User not logged in:', error);
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login if not logged in
      }
    };
    checkLoginStatus();
  }, [navigate]);

  // Effect to fetch events and categories when the component mounts
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Function to fetch all events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEvents(data); // Store the events in the state
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Function to fetch all categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API_URL);
      const data = await response.json();
      setCategories(data); // Store the categories in the state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to convert time to 24-hour format (e.g., "2:30 PM" to "14:30")
  const convertTo24HourFormat = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours) + 12;  // Convert PM to 24-hour format
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";  // Convert 12 AM to 00
    }

    return `${hours.padStart(2, "0")}:${minutes}`;  // Ensure two digits for hours
  };

  // Function to handle editing an event: sets the selected event and formats date/time
  const handleEditClick = (event) => {
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
    const formattedTime = event.time ? convertTo24HourFormat(event.time) : "";

    setSelectedEvent({
      ...event,
      date: formattedDate,
      time: formattedTime, // Set the time in 24-hour format
    });
  };

  // Function to close the edit modal
  const handleCloseModal = () => {
    setSelectedEvent(null); // Clear the selected event
  };

  // Function to save the updated event to the API
  const handleSave = async () => {
    try {
      const updatedEvent = {
        title: selectedEvent.title,
        description: selectedEvent.description,
        place: selectedEvent.place,
        date: selectedEvent.date,
        time: selectedEvent.time,
        category_id: selectedEvent.category_id,
      };

      const response = await fetch(`http://localhost:5000/api/events/${selectedEvent.id}`, {
        method: "PUT", // Use PUT method to update the event
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent), // Send the updated event data
      });

      if (response.ok) {
        fetchEvents(); // Refresh the events after successful update
        handleCloseModal(); // Close the modal after saving
      } else {
        console.error("Failed to update event"); // Handle error if update fails
      }
    } catch (error) {
      console.error("Error updating event:", error); // Log any error during the update process
    }
  };

  return (
    <div className="event-container">
      <h1>All Events</h1>
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <div className="event-content">
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p>{event.description}</p>
            </div>
            <button className="edit-button" onClick={() => handleEditClick(event)}>Edit</button>
          </div>
        ))}
      </div>

      {/* Modal for editing an event */}
      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Event</h2>
            <label>Title:</label>
            <input
              type="text"
              value={selectedEvent.title}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />
            <label>Date:</label>
            <input
              type="date"
              value={selectedEvent.date}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
            />
            <label>Time:</label>
            <input
              type="time"
              value={selectedEvent.time}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
            />
            <label>Place:</label>
            <input
              type="text"
              value={selectedEvent.place}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, place: e.target.value })}
            />
            <label>Category:</label>
            <select
              value={selectedEvent.category_id}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label>Description:</label>
            <textarea
              value={selectedEvent.description}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button> {/* Save the updated event */}
              <button onClick={handleCloseModal}>Cancel</button> {/* Close the modal without saving */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateEvent;