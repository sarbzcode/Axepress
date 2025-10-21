import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateNotice from './CreateNotice';
import CreateEvent from './CreateEvent';
import DeleteNotice from './DeleteNotice';
import UpdateNotice from './UpdateNotice';
import UpdateEvent from './UpdateEvent';
import DeleteEvent from './DeleteEvent';

import '@styles/AdminDashboard.css';

const AdminDashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [activeTask, setActiveTask] = useState('/create-notice');

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/count`);
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tasks = [
    { name: 'Create Notice', path: '/create-notice', icon: '\u{1F4DD}' },
    { name: 'Update Notice', path: '/update-notice', icon: '\u270F\uFE0F' },
    { name: 'Delete Notice', path: '/delete-notice', icon: '\u{1F5D1}\uFE0F' },
    { name: 'Create Event', path: '/create-event', icon: '\u{1F389}' },
    { name: 'Update Event', path: '/update-event', icon: '\u{1F6E0}\uFE0F' },
    { name: 'Delete Event', path: '/delete-event', icon: '\u274C' },
  ];

  const handleTaskClick = (taskPath) => {
    setActiveTask(taskPath);
  };

  const renderActiveContent = () => {
    switch (activeTask) {
      case '/create-notice':
        return (
            <CreateNotice />
        );
      case '/update-notice':
        return (
            <UpdateNotice />
        );
      case '/delete-notice':
        return (
            <DeleteNotice />
        );
      case '/create-event':
        return (
            <CreateEvent />
        );
      case '/update-event':
        return (
            <UpdateEvent />
        );
      case '/delete-event':
        return (
            <DeleteEvent />
        );
      default:
        return (
          <div className="panel-content">
            <div className="panel-header">
              <h2>Admin Task</h2>
              <p>Select a task to get started.</p>
            </div>
            <div className="panel-placeholder">
              <span>Choose a task from the sidebar.</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <h2>Admin Dashboard</h2>
            <p className="sidebar-subtitle">{'\u{1F465}'} Total Users: {userCount}</p>
            <p className="sidebar-summary">Manage notices, events, and more with the controls below.</p>
          </div>
          <nav className="sidebar-tasks" aria-label="Admin tasks">
            {tasks.map((task) => (
              <button
                key={task.path}
                type="button"
                className={`task-button${activeTask === task.path ? ' active' : ''}`}
                onClick={() => handleTaskClick(task.path)}
                aria-pressed={activeTask === task.path}
              >
                <span className="task-icon" aria-hidden="true">{task.icon}</span>
                <span>{task.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>
      <main className="admin-main">
        {renderActiveContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
