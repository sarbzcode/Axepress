import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/Login.css';

const Login = ({ setIsLoggedIn }) => {
  // State to hold form data (username and password)
  const [formData, setFormData] = useState({ username: '', password: '' });
  // State to hold error message
  const [error, setError] = useState('');
  // State to hold success feedback
  const [success, setSuccess] = useState('');
  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useNavigate hook for redirecting to different pages
  const navigate = useNavigate();

  // Handle change in form input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Send login request to the server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {withCredentials: true});
      if (response.status === 200) {
        // Store user data in localStorage upon successful login
        localStorage.setItem('user', JSON.stringify(response.data));
        if (typeof setIsLoggedIn === 'function') {
          setIsLoggedIn(true);
        }
        setSuccess('Login successful. Redirecting to dashboard...');
        setTimeout(() => navigate('/admindashboard'), 1200);
        return;
      }
      
    } catch (err) {
      // Set error message if login fails
      setError('Invalid username or password.');
      setIsSubmitting(false);
      return;
    }
    // Reset loading state if response was not a success
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <section className="auth-panel">
        <header className="auth-panel__header">
          <span className="auth-panel__eyebrow">AxePress Admin</span>
          <h2 className="auth-panel__title">Welcome back</h2>
          <p className="auth-panel__description">
            Sign in to manage events, notices, and keep the community up to date.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Show feedback messages */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* Login form */}
          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              value={formData.username}
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
