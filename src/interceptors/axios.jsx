import axios from "axios";

// Set default base URL
axios.defaults.baseURL = import.meta.env.VITE_SERVER_API_URL;

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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (!storedRefreshToken) {
          removeAccessToken();
          window.location.href = "/sign-in";
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_SERVER_API_URL}auth/refresh-admin-token`,
          { refreshToken: storedRefreshToken }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;
        const newRefreshToken = refreshResponse.data.data.refreshToken;

        setAccessToken(newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        removeAccessToken();
        localStorage.removeItem("refreshToken");
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

