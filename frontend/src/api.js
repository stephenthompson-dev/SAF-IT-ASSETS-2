import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response; // Return the response if no error
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh`, {
                        token: refreshToken
                    });

                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError);
                }
            } else {
                console.error("No refresh token available.");
            }
        }

        return Promise.reject(error);
    }
);

export default api; // Ensure this line is present
