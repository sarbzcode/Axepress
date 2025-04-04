import {Link, useNavigate} from "react-router-dom"
import "@styles/Navbar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from '@assets/favicon.png';
const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {

  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          await axios.post('http://localhost:5000/api/auth/logout', {}, {withCredentials: true});
          setIsLoggedIn(false);
          navigate('/login');
      } catch (error){
          console.error('Logout failed:', error);
      }
  };

    return (
        <nav className="navbar">
  <div className="container">
    <div className="nav-left">
        <img src={Logo} className="imgLogo" alt="Axepress Logo" />
      <Link to="/" className="logo">Axepress</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/notices/all">Notices</Link></li>
        <li><Link to="/events/all">Events</Link></li>
      </ul>
    </div>

    <div className="nav-right">
      <ul className="auth-links">
        {!isLoggedIn ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        ) : (
          <>
            <li className="admin"><Link to="/admindashboard">Admin Dashboard</Link></li>
            <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
          </>
        )}
      </ul>
    </div>
  </div>
</nav>


    );
};

export default Navbar;