// src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  console.log("Auth Context:", context); // Debugging: log the context to ensure user and tokens are set
  return context;
};

export default useAuth;
