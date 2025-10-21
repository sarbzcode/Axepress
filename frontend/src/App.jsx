import React, { useState, lazy, useEffect } from "react"; // Import React hooks and lazy loading for components
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom"; // Import React Router components for routing
import "@styles/App.css"; // Import custom styles for the app
import axios from "axios"; // Import Axios for HTTP requests
import Navbar from "@components/Website/Navbar"; // Import Navbar component
import AppRoutes from "./AppRoutes"; // Import AppRoutes for routing logic
import FooterBar from "@components/Website/FooterBar"; // Import FooterBar component
// Lazy load components to optimize performance by loading only what's needed dynamically
const Home = lazy(() => import("./components/Website/Home"));
const Notices = lazy(() => import("./components/Categories/Notices"));
const Events = lazy(() => import("./components/Categories/Events"));
const NoticeDetail = lazy(() => import("./components/Categories/NoticeDetail"));
const EventDetail = lazy(() => import("./components/Categories/EventDetail"));
const Login = lazy(() => import("./components/Authentication/Login"));
const Signup = lazy(() => import("./components/Authentication/Signup"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
const Contact = lazy(() => import("./components/Categories/Contact"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state for managing login status

  // Function to check the login status of the user by making an API call
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/status`,
        { withCredentials: true }
      );
      setIsLoggedIn(response.data.loggedIn); // Set the login status based on API response
    } catch (error) {
      console.error("Error checking login status:", error); // Log any error during the check
      setIsLoggedIn(false); // Default to false if there is an error
    }
  };

  // useEffect hook to check login status when the component is mounted and periodically check it
  useEffect(() => {
    checkLoginStatus(); // Check login status initially
    const intervalId = setInterval(checkLoginStatus, 1000); // Periodically check login status every 1 second
    return () => clearInterval(intervalId); // Clean up the interval when component unmounts
  }, []);

  return (
    <>
      <Router>
        {" "}
        {/* Router component to handle routing for the app */}
        <div className="app-container">
          {" "}
          {/* Main app container */}
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />{" "}
          {/* Navbar with login status */}
          <AppRoutes
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />{" "}
          {/* Main routes for the app */}
          <FooterBar /> {/* Footer component */}
        </div>
      </Router>
    </>
  );
}

export default App;
