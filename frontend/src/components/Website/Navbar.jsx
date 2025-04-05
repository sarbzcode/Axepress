import { Link, useNavigate } from "react-router-dom"; // Importing necessary components from react-router-dom
import "@styles/Navbar.css"; // Import custom styles for the navbar
import axios from "axios"; // Import Axios for making HTTP requests
import Logo from '@assets/favicon.png'; // Import logo image

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle user logout
  const handleLogout = async () => {
      try {
          // API call to logout the user
          await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
          setIsLoggedIn(false); // Update the login state
          navigate('/login'); // Redirect to login page
      } catch (error){
          console.error('Logout failed:', error); // Log any errors that occur during logout
      }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-left">
          {/* Logo and Brand Link */}
          <img src={Logo} className="imgLogo" alt="Axepress Logo" />
          <Link to="/" className="logo">Axepress</Link>

          {/* Navigation links */}
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/notices/all">Notices</Link></li>
            <li><Link to="/events/all">Events</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          {/* Authentication-related links */}
          <ul className="auth-links">
            {!isLoggedIn ? (
              // If the user is not logged in, show login/signup links
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
              </>
            ) : (
              // If the user is logged in, show logout and admin dashboard links
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