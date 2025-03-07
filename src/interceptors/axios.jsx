import axios from "axios";

// Set default base URL
axios.defaults.baseURL = import.meta.env.VITE_LOCAL_API_URL;

// Ensure cookies (refreshToken) are sent with requests
axios.defaults.withCredentials = true;

// Helper functions for token management
const getAccessToken = () => localStorage.getItem("accessToken");
const setAccessToken = (token) => localStorage.setItem("accessToken", token);
const removeAccessToken = () => localStorage.removeItem("accessToken");

// Request Interceptor → Attach the access token to every request
axios.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → Handle Token Expiration & Refresh Token
axios.interceptors.response.use(
  (response) => response, // If response is successful, return it
  async (error) => {
    const originalRequest = error.config;

    // If Unauthorized (401) and request is not retried yet, try refreshing token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried to prevent loops

      try {
        // Request new access token
        // const refreshResponse = await axios.get("auth/refresh-admin-token");
        const refreshResponse = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}auth/refresh-admin-token`,
          { withCredentials: true } // Ensure cookies are included
        );

        // Extract and store new access token
        const newAccessToken = refreshResponse.data.data.accessToken;
        setAccessToken(newAccessToken);

        // Update Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // Retry the failed request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear access token and redirect to login if refresh fails
        removeAccessToken();
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
