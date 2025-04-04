import React, { useState, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import '@styles/App.css';
import axios from "axios";
import Navbar from '@components/Website/Navbar';
import AppRoutes from './AppRoutes';
import FooterBar from '@components/Website/FooterBar';

// Lazy loading components load elements dynamically instead of loading everything at once
const Home = lazy(() => import('./components/Website/Home'));
const Notices = lazy(() => import('./components/Categories/Notices'));
const Events = lazy(() => import('./components/Categories/Events'));
const NoticeDetail = lazy(() => import('./components/Categories/NoticeDetail'));
const EventDetail = lazy(() => import('./components/Categories/EventDetail'));
const Login = lazy(() => import('./components/Authentication/Login'));
const Signup = lazy(() => import('./components/Authentication/Signup'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/status', { withCredentials: true });
      setIsLoggedIn(response.data.loggedIn);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Router>
        <div className="app-container">
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <FooterBar />
        </div>
      </Router>
      </>
  );
}

export default App;