import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/Signup.css';

const Signup = () => {
  // State to hold form data (name, username, email, password, invitation code)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    invitationCode: '',
  });
  // State to hold error message
  const [error, setError] = useState('');
  // State to hold success message after account creation
  const [success, setSuccess] = useState('');
  // State to handle form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useNavigate hook to navigate programmatically
  const navigate = useNavigate();

  // Handle change in form input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Set submitting state to true when form is submitted

    // Check if the invitation code matches the valid code before submitting
    const validCode = 'GoAcadiaGo'; // Secret invitation code for authorized users
    if (formData.invitationCode !== validCode) {
      setError('Invalid invitation code. Only club leaders/presidents or social media managers can sign up.');
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    try {
      // Send signup request to the server
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      setSuccess('Account created successfully. Please log in.');
      // Redirect to login page after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Handle error during signup and display message
      console.log('Error during signup:', err);
      setError('Error creating account. Try again.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      {/* Display error or success message */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Input fields for user details */}
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="invitationCode" placeholder="Invitation Code" onChange={handleChange} required />
        {/* Submit button with loading state */}
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Signup'}</button>
      </form>
    </div>
  );
};

export default Signup;