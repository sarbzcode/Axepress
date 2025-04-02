import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './components/Home';
import Notices from './components/Notices';
import Events from './components/Events';
import NoticeDetail from './components/NoticeDetail';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import './styles/App.css';

function App() {
  // isAdmin is set by the Login component once a user logs in.
  // No extra API call is made here because express-session on the backend handles authentication.
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <ErrorBoundary>
      <Router>
        <div>
          <nav>
            <Link className="home" to="/">Home</Link>
            <Link className="notices" to="/notices">Notices</Link>
            <Link className="events" to="/events">Events</Link>
            {isAdmin && <Link className="admin" to="/admindashboard">Admin Dashboard</Link>}
            {!isAdmin && (
              <>
                <Link className="login" to="/login">Login</Link>
                <Link className="signup" to="/signup">Signup</Link>
              </>
            )}
          </nav>
          <div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/events" element={<Events />} />
              <Route path="/notices/:id" element={<NoticeDetail />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/admindashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;