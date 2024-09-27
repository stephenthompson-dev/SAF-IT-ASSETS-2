// api.js

import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // Ensure no trailing slash
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response; // Return the response if no error
    },
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (refreshToken) {
                try {
                    // Option 1: Using string concatenation
                    // const refreshUrl = `${import.meta.env.VITE_API_URL}/api/token/refresh/`;

                    // Option 2: Using url-join
                    const refreshUrl = urlJoin(import.meta.env.VITE_API_URL, "/api/token/refresh/");

                    const response = await axios.post(refreshUrl, {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError);
                    // Optionally, redirect to login or show a message to the user
                }
            } else {
                console.error("No refresh token available.");
                // Optionally, redirect to login or show a message to the user
            }
        }

        return Promise.reject(error);
    }
);

export default api;
