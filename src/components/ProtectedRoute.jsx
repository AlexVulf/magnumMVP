import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // This is a simple check. In a real app, you'd decode the token
  // and check the user's role and token expiration.
  if (adminOnly) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'ADMIN') {
        return <Navigate to="/login" />;
      }
    } catch (e) {
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
