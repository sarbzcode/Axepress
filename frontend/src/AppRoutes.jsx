import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@components/Website/Home';
import Notices from '@components/Categories/Notices';
import Events from '@components/Categories/Events';
import NoticeDetail from '@components/Categories/NoticeDetail';
import EventDetail from '@components/Categories/EventDetail';
import Login from '@components/Authentication/Login';
import Signup from '@components/Authentication/Signup';
import AdminDashboard from '@components/Admin/AdminDashboard';
import CreateNotice from './components/Admin/CreateNotice';
import UpdateNotice from './components/Admin/UpdateNotice';
import DeleteNotice from './components/Admin/DeleteNotice';
import CreateEvent from './components/Admin/CreateEvent';
import UpdateEvent from './components/Admin/UpdateEvent';
import DeleteEvent from './components/Admin/DeleteEvent';
import Contact from '@components/Categories/Contact';

function AppRoutes({ isLoggedIn, setIsLoggedIn }) {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Home />} />  {/* Home page */}
      <Route path="/notices/all" element={<Notices />} />  {/* Displays all notices */}
      <Route path="/events/all" element={<Events />} />  {/* Displays all events */}
      <Route path="/notices/:id" element={<NoticeDetail />} />  {/* Displays notice details by ID */}
      <Route path="/events/:id" element={<EventDetail />} />  {/* Displays event details by ID */}
      <Route path="/contact" element={<Contact />} />  {/* Displays contact form */}
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />  {/* Login page */}
      <Route path="/signup" element={<Signup />} />  {/* Signup page */}

      {/* Admin Routes */}
      {/* Admin dashboard is protected and will only render if the user is logged in */}
      <Route
        path="/admindashboard"
        element={
          isLoggedIn ? (
            <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Admin CRUD Routes (Create, Update, Delete notices and events) */}
      <Route path='/create-notice' element={<CreateNotice />} />  {/* Page for creating a notice */}
      <Route path='/update-notice' element={<UpdateNotice />} />  {/* Page for updating a notice */}
      <Route path='/delete-notice' element={<DeleteNotice />} />  {/* Page for deleting a notice */}
      <Route path='/create-event' element={<CreateEvent />} />  {/* Page for creating an event */}
      <Route path='/update-event' element={<UpdateEvent />} />  {/* Page for updating an event */}
      <Route path='/delete-event' element={<DeleteEvent />} />  {/* Page for deleting an event */}
      
    </Routes>
  );
}

export default AppRoutes;
