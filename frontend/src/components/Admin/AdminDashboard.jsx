// Import necessry dependencies
import React, {useEffect, useState} from 'react'; // React hooks for managing state and side effects
import { useNavigate } from 'react-router-dom'; // React Router hook to navigate between routes
import axios from 'axios'; // Axios for making HTTP requests
import '@styles/AdminDashboard.css'; // Importing the CSS file for styling

const AdminDashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [userCount, setUserCount] = useState(0); // State to store the user count

  // useEffect to fetch the user count when the component is mounted
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        // Making a GET request to the backend to fetch the user count
        const response = await axios.get('http://localhost:5000/api/users/count');
        setUserCount(response.data.userCount); // Update the state with the fetched user count
      } catch (error) {
        console.error('Error fetching user count:', error); // Log any error that occurs
      }
    };
    fetchUserCount(); // Call the function to fetch user count on component mount
  }, []); // Empty dependency array ensures it runs only once after initial render

  // Logout handler function
  const handleLogout = async () => {
    try {
      // Making a POST request to the backend for logging out
      await axios.post('http://localhost:5000/api/auth/logout', {}, {withCredentials: true});
      setIsLoggedIn(false); // Update the logged-in state to false
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Logout failed:', error); // Log any error that occurs during logout
    }
  };  

  // Task list for the admin to perform different actions
  const tasks = [
    {name: 'Create a Notice', path: '/create-notice'},
    {name: 'Update a Notice', path: '/update-notice'},
    {name: 'Delete a Notice', path: '/delete-notice'},
    { name: 'Create an Event', path: '/create-event' },
    { name: 'Update an Event', path: '/update-event' },
    { name: 'Delete an Event', path: '/delete-event' },
  ];

  // Handler for task button click to navigate to the corresponding path
  const handleTaskClick = (path) => {
    navigate(path); // Navigate to the given task path
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