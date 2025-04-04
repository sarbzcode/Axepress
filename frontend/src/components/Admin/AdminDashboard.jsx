import React, {useEffect, useState} from 'react';
import CreateNotice from '../Admin/CreateNotice';
import UpdateNotice from '../Admin/UpdateNotice';
import DeleteNotice from '../Admin/DeleteNotice';
import CreateEvent from '../Admin/CreateEvent';
import UpdateEvent from '../Admin/UpdateEvent';
import DeleteEvent from '../Admin/DeleteEvent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/AdminDashboard.css';

const AdminDashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/count');
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };
    fetchUserCount();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {withCredentials: true});
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };  

  const tasks = [
    {name: 'Create a Notice', path: '/create-notice'},
    {name: 'Update a Notice', path: '/update-notice'},
    {name: 'Delete a Notice', path: '/delete-notice'},
    { name: 'Create an Event', path: '/create-event' },
    { name: 'Update an Event', path: '/update-event' },
    { name: 'Delete an Event', path: '/delete-event' },
  ];

  const handleTaskClick = (path) => {
    navigate(path);
  }

  return (
    <div className='admin-dashboard'>
      <h1>Admin Dashboard</h1>
      <h3>Tasks:</h3>
      <div className='task-list'>
        {tasks.map((task, index) => (
          <button key={index} onClick={() => handleTaskClick(task.path)} className="task-item">
            {task.name}
          </button>
        ))}
      </div>
      <div className='user-count'>
        <h3>Total Users Signed Up: {userCount}</h3>
      </div>
      <button onClick={handleLogout} className='logout-button'>Logout</button>
    </div>
  )
}

export default AdminDashboard;