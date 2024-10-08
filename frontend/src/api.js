import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // Update with your API base URL
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

export default api;
