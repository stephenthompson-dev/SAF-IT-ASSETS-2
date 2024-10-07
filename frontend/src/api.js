import axios from 'axios';
import { useEffect } from 'react';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',  // Update with your API base URL
  withCredentials: true,  // Allow credentials such as cookies to be sent with requests
});

// Function to get CSRF token and set it globally in the Axios instance
export const getCsrfToken = async () => {
  try {
    const response = await api.get('/auth/csrf/');
    const csrfToken = response.data.csrfToken;

    // Set CSRF token for all future requests
    api.defaults.headers['X-CSRFToken'] = csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token', error);
  }
};

// Custom hook for using CSRF token in React components
export const useCsrfToken = () => {
  useEffect(() => {
    // Fetch and set the CSRF token when the component mounts
    const fetchCsrfToken = async () => {
      await getCsrfToken();
    };
    fetchCsrfToken();
  }, []);  // Empty dependency array to run once on mount
};

export default api;
