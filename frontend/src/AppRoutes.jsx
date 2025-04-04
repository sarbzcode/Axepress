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

function AppRoutes({ isLoggedIn, setIsLoggedIn }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notices/all" element={<Notices />} />
      <Route path="/events/all" element={<Events />} />
      <Route path="/notices/:id" element={<NoticeDetail />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
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
      <Route path='/create-notice' element={<CreateNotice />} />
      <Route path='/update-notice' element={<UpdateNotice />} />
      <Route path='/delete-notice' element={<DeleteNotice />} />
      <Route path='/create-event' element={<CreateEvent />} />
      <Route path='/update-event' element={<UpdateEvent />} />
      <Route path='/delete-event' element={<DeleteEvent />} />
    </Routes>
  );
}

export default AppRoutes;