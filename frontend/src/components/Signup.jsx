import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    invitationCode: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check invitation code before submitting
    const validCode = 'AcadiaU@AxeConnect'; // Secret code for club leaders only
    if (formData.invitationCode !== validCode) {
      setError('Invalid invitation code. Only club leaders/presidents or social media managers can sign up.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      setSuccess('Account created successfully. Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error creating account. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        
        <input type="text" name="invitationCode" placeholder="Invitation Code" onChange={handleChange} required />
        
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;