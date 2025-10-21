import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importing necessary components from react-router-dom
import "@styles/Navbar.css"; // Import custom styles for the navbar
import axios from "axios"; // Import Axios for making HTTP requests
import logo from '@assets/AxepressLogo.png';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {

  const navigate = useNavigate(); // Hook for programmatic navigation
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Function to handle user logout
  const handleLogout = async () => {
      try {
          // API call to logout the user
          await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
          setIsLoggedIn(false); // Update the login state
          navigate('/login'); // Redirect to login page
      } catch (error){
          console.error('Logout failed:', error); // Log any errors that occur during logout
      }
      setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      const delta = Math.abs(currentY - lastScrollY.current);

      if (scrollingDown && currentY > 120 && delta > 6) {
        setIsNavVisible(false);
        setMenuOpen(false);
      } else if (!scrollingDown && delta > 6) {
        setIsNavVisible(true);
      } else if (currentY <= 120) {
        setIsNavVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setIsNavVisible(true);
    }
  }, [menuOpen]);

  return (
    <nav className={`navbar ${isNavVisible ? "" : "navbar--hidden"}`}>
      <div className="container">
        <div className="nav-left">
          <div className="brand">
            {/* Logo and Brand Link */}
            <Link to="/" className="logo" onClick={handleLinkClick}>
              <img src={logo} className="logoImg" alt="Axepress logo" />
              <span className="logo-letter" aria-hidden="true">A</span>
            </Link>
            <button
              type="button"
              className={`menu-toggle ${menuOpen ? "open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={toggleMenu}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="menu-icon" />
            </button>
          </div>

          {/* Navigation links */}
          <ul className={`nav-links ${menuOpen ? "open" : ""}`} id="primary-nav">
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Contact Us</Link></li>
            {!isLoggedIn ? (
              // If the user is not logged in, show login/signup links
              <>
                <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
                <li><Link to="/signup" onClick={handleLinkClick}>Signup</Link></li>
              </>
            ) : (
              // If the user is logged in, show logout and admin dashboard links
              <>
                <li className="admin"><Link to="/admindashboard" onClick={handleLinkClick}>Admin Dashboard</Link></li>
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
