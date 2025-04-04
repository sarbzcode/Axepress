import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@styles/Login.css';
import headerImage from '@assets/Acadia_Login.jpeg';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData, {withCredentials: true});
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/admindashboard');
      }
      
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container" >
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
