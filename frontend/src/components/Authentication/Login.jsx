import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/Login.css';

const Login = () => {
  // State to hold form data (username and password)
  const [formData, setFormData] = useState({ username: '', password: '' });
  // State to hold error message
  const [error, setError] = useState('');
  // useNavigate hook for redirecting to different pages
  const navigate = useNavigate();

  // Handle change in form input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (error) {
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/api/auth/login', formData, {withCredentials: true});
      if (response.status === 200) {
        // Store user data in localStorage upon successful login
        localStorage.setItem('user', JSON.stringify(response.data));
        // Redirect to the admin dashboard
        navigate('/admindashboard');
      }
      
    } catch (err) {
      // Set error message if login fails
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container" >
      <h2>Login</h2>
      {/* Show error message if there's any */}
      {error && <p className="error">{error}</p>}
      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          value={formData.username} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          value={formData.password} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;