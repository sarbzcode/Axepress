import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/UpdateEvent.css';

const API_URL = "http://localhost:5000/api/events/all";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const UpdatedEvent = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    fetchEvents();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const convertTo24HourFormat = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours) + 12;  // Add 12 for PM
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";  // Convert 12 AM to 00
    }

    return `${hours.padStart(2, "0")}:${minutes}`;  // Ensure 2 digits for hours
  };

  const handleEditClick = (event) => {
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
    const formattedTime = event.time ? convertTo24HourFormat(event.time) : "";

    setSelectedEvent({
      ...event,
      date: formattedDate,
      time: formattedTime,  // Pass 24-hour time format
    });
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        fetchEvents();
        handleCloseModal();
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
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
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatedEvent;