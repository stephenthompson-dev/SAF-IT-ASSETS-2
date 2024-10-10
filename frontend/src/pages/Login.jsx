import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/UI/LoadingIndicator'; // Make sure this component exists
import api, { getCsrfToken } from '../api';  // Import the Axios instance and CSRF token helper
import { toast } from 'react-toastify';  // For better notifications
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-slate-500 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 text-slate-900 bg-slate-200 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 text-slate-900 bg-slate-200 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>
          
          {loading && <LoadingIndicator />}  {/* Show a loading indicator when the request is in progress */}
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-slate-800 text-white font-medium rounded-md shadow-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            disabled={loading}  // Disable button while loading
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
