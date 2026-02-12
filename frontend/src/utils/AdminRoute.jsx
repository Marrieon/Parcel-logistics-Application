import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';

const AdminRoute = () => {
  const user = useSelector(selectCurrentUser);

  // User is authenticated and the user object has isAdmin flag set to true
  if (user && user.isAdmin) {
    return <Outlet />;
  }
  
  // If not an admin, redirect to the user dashboard
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;