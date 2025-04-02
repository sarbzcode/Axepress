import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import CreateNotice from './CreateNotice';
import UpdateEvent from './UpdateEvent';
import UpdateNotice from './UpdateNotice';
import CreateEvent from './CreateEvent';
import DeleteEvent from './DeleteEvent';
import DeleteNotice from './DeleteNotice';

const AdminDashboard = () => {
  const navigate = useNavigate(); // This helps us move to different pages
  const [notices, setNotices] = useState([]); // This keeps track of all the notices
  const [events, setEvents] = useState([]); // This keeps track of all the events
  const [selectedNotice, setSelectedNotice] = useState(null); // This keeps track of the notice we're editing
  const [selectedEvent, setSelectedEvent] = useState(null); // This keeps track of the event we're editing

  // This is like telling the computer: "Hey, go get the notices and events when the page first opens!"
  useEffect(() => {
    fetchNotices();
    fetchEvents();
  }, []);

  // This function goes and gets the notices from the computer's storage
  const fetchNotices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notices");
      setNotices(response.data); // Store the notices we got from the storage
    } catch (error) {
      console.error("Oops! Something went wrong with getting the notices.", error);
    }
  };

  // This function goes and gets the events from the computer's storage
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data); // Store the events we got from the storage
    } catch (error) {
      console.error("Oops! Something went wrong with getting the events.", error);
    }
  };

  // When a new notice is added, we add it to our list of notices
  const handleNoticeAdded = (newNotice) => {
    setNotices([...notices, newNotice]);
  };

  // When a new event is added, we add it to our list of events
  const handleEventAdded = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  // When a notice is updated, we find it in the list and change it
  const handleNoticeUpdated = (updatedNotice) => {
    setNotices(notices.map((n) => (n.id === updatedNotice.id ? updatedNotice : n)));
    setSelectedNotice(null); // No more editing the notice now
  };

  // When an event is updated, we find it in the list and change it
  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setSelectedEvent(null); // No more editing the event now
  };

  // When a notice is deleted, we remove it from our list of notices
  const handleNoticeDeleted = (noticeId) => {
    setNotices(notices.filter((n) => n.id !== noticeId));
  };

  // When an event is deleted, we remove it from our list of events
  const handleEventDeleted = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  // This makes us leave the page and go to the login page
  const logOut = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    navigate('/login'); // Take us to the login page
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="log-out-container">
            <button className="btn-logout" onClick={logOut}>Log Out</button> {/* Log out button */}
        </div>
      </div>
      
      {/* This part lets us manage notices */}
      <section className="notices-section">
          <h2 className="section-heading">Manage Notices</h2>
          <div className="create-notice-form">
              <CreateNotice onNoticeAdded={handleNoticeAdded} /> {/* Form to add a new notice */}
          </div>
          <div className="notices-list">
              {notices.map((notice) => (
                  <div key={notice.id} className="notice-item card">
                      <h3 className="notice-title">{notice.title}</h3>
                      <p className="notice-description">{notice.description}</p>
                      <div className="notice-actions">
                          <button className="btn-edit" onClick={() => setSelectedNotice(notice)}>Edit</button>
                          <DeleteNotice className="btn-delete" noticeId={notice.id} onNoticeDeleted={handleNoticeDeleted} />
                      </div>
                  </div>
              ))}
          </div>
          {selectedNotice && (
              <div className="update-notice-form">
                  <UpdateNotice noticeId={selectedNotice.id} onNoticeUpdated={handleNoticeUpdated} />
              </div>
          )}
      </section>

      {/* This part lets us manage events */}
      <section className="events-section">
          <h2 className="section-heading">Manage Events</h2>
          <div className="create-event-form">
              <CreateEvent onEventAdded={handleEventAdded} /> {/* Form to add a new event */}
          </div>
          <div className="events-list">
              {events.map((event) => (
                  <div key={event.id} className="event-item card">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description">{event.description}</p>
                      <p className="event-details">{event.place} - {event.date} at {event.time}</p>
                      <div className="event-actions">
                          <button className="btn-edit" onClick={() => setSelectedEvent(event)}>Edit</button>
                          <DeleteEvent className="btn-delete" eventId={event.id} onEventDeleted={handleEventDeleted} />
                      </div>
                  </div>
              ))}
          </div>
          {selectedEvent && (
              <div className="update-event-form">
                  <UpdateEvent eventId={selectedEvent.id} onEventUpdated={handleEventUpdated} />
              </div>
          )}
      </section>
    </div>
  );
};

export default AdminDashboard;