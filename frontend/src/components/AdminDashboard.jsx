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
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchNotices();
    fetchEvents();
}, []);

const fetchNotices = async () => {
  try {
      const response = await axios.get("http://localhost:5000/api/notices");
      setNotices(response.data);
  } catch (error) {
      console.error("Error fetching notices:", error);
  }
};

const fetchEvents = async () => {
  try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data);
  } catch (error) {
      console.error("Error fetching events:", error);
  }
};

const handleNoticeAdded = (newNotice) => {
  setNotices([...notices, newNotice]);
};

const handleEventAdded = (newEvent) => {
  setEvents([...events, newEvent]);
};

const handleNoticeUpdated = (updatedNotice) => {
  setNotices(notices.map((n) => (n.id === updatedNotice.id ? updatedNotice : n)));
  setSelectedNotice(null);
};

const handleEventUpdated = (updatedEvent) => {
  setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  setSelectedEvent(null);
};

const handleNoticeDeleted = (noticeId) => {
  setNotices(notices.filter((n) => n.id !== noticeId));
};

const handleEventDeleted = (eventId) => {
  setEvents(events.filter((e) => e.id !== eventId));
};

  const logOut = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
       <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="log-out-container">
            <button className="btn-logout" onClick={logOut}>Log Out</button>
        </div>
        </div>
        {/* Notices Section */}
        <section className="notices-section">
            <h2 className="section-heading">Manage Notices</h2>
            <div className="create-notice-form">
                <CreateNotice onNoticeAdded={handleNoticeAdded} />
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

        {/* Events Section */}
        <section className="events-section">
            <h2 className="section-heading">Manage Events</h2>
            <div className="create-event-form">
                <CreateEvent onEventAdded={handleEventAdded} />
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