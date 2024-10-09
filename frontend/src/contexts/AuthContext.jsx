import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { getCsrfToken} from '../api';  // Axios instance, ensure it has withCredentials enabled
import { toast } from 'react-toastify';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // Manage loading state

  // Function to check authentication status and rehydrate session
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getCsrfToken();
        // Check if the user is authenticated by checking the session
        const response = await api.get('/auth/me/', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);  // Ensure loading state is updated
      }
    };
  
    checkAuthStatus();  // Call session and CSRF check on page load
  }, []);

  // Function to handle login
  const login = async (username, password) => {
    setIsLoading(true);  // Set loading during login
    try {
      debugger
      await getCsrfToken();
      const response = await api.post('/auth/login/',  { username, password });
      if (response.status === 200) {
        const userResponse = await api.get('/auth/me/');
        setUser(userResponse.data);
        toast.success('Logged in successfully!');
      } else {
        throw new Error('Login failed.');
      }
    } catch (error) {
      throw new Error('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const logout = async () => {
    setIsLoading(true);  // Set loading during logout
    try {
      // Fetch CSRF token before making the logout request
      await getCsrfToken();
      await api.post('/auth/logout/');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // this is only for TypeScript - should probs be removed
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
