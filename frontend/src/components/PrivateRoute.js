import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking user status
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if user is not authenticated
  }

  return children; // Render children if user is authenticated
};

export default PrivateRoute;
