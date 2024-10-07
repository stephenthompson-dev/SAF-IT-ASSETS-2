import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';  // Axios instance, ensure it has withCredentials enabled
import { toast } from 'react-toastify';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/auth/me/', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);  // Set user data if the request succeeds
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        toast.error('Failed to check authentication status.');  // Show error toast if request fails
        setUser(null);
      } finally {
        setIsLoading(false);  // Ensure loading state is updated
      }
    };

    checkAuthStatus();
  }, []);

  // Function to handle login
  const login = async (username, password) => {
    setIsLoading(true);  // Set loading during login
    try {
      // Fetch CSRF token before making the login request
      const csrfResponse = await api.get('/auth/csrf/');
      const csrfToken = csrfResponse.data.csrfToken;

      // Perform login request
      const response = await api.post(
        '/auth/login/', 
        { username, password }, 
        {
          headers: {
            'X-CSRFToken': csrfToken,  // Pass the CSRF token in the header
          },
          withCredentials: true,  // Include credentials in the request
        }
      );

      if (response.status === 200) {
        setUser(response.data);  // Set logged-in user data
        toast.success('Logged in successfully!');  // Show success toast
        return { success: true };
      } else {
        throw new Error('Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');  // Show error toast
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);  // Set loading to false after the request
    }
  };

  // Function to handle logout
  const logout = async () => {
    setIsLoading(true);  // Set loading during logout
    try {
      // Fetch CSRF token before making the logout request
      const csrfResponse = await api.get('/auth/csrf/');
      const csrfToken = csrfResponse.data.csrfToken;

      // Perform logout request
      await api.post(
        '/auth/logout/',
        {},
        {
          headers: {
            'X-CSRFToken': csrfToken,  // Pass the CSRF token in the header
          },
          withCredentials: true,  // Include credentials in the request
        }
      );

      setUser(null);  // Clear user data after logout
      toast.success('Logged out successfully!');  // Show success toast
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout.');  // Show error toast
    } finally {
      setIsLoading(false);  // Set loading to false after the request
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
