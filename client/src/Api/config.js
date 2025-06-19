import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceForMultipart = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add a request interceptor to include the Clerk token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from localStorage if available (will be set by AuthContext)
    const token = localStorage.getItem('clerk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - let the browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh the token
      try {
        // Trigger a custom event that the AuthContext can listen to
        window.dispatchEvent(new CustomEvent('refresh_clerk_token'));
        
        // Wait a bit for the token to be refreshed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the new token and retry the request
        const newToken = localStorage.getItem('clerk_token');
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear invalid token
        localStorage.removeItem('clerk_token');
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
