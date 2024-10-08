import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();  // Fetch user and loading status from AuthContext
  const location = useLocation();  // Store location to redirect back after login

  // Show loading spinner or message while the auth status is being checked
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role, if passed as a prop (optional)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;  // Redirect to unauthorized page if role mismatch
  }

  return <>{children}</>;  // Render the protected content if the user is authorized
};

export default ProtectedRoute

