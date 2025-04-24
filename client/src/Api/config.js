import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_SERVER_HOST,
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Add request interceptor to include Clerk token in all requests
axiosInstance.interceptors.request.use(
   async (config) => {
      try {
         // Get the token from Clerk's session
         const token = await window.Clerk?.session?.getToken();
         
         // If token exists, add it to the Authorization header
         if (token) {
            config.headers.Authorization = `Bearer ${token}`;
         }
      } catch (error) {
         console.error('Failed to add authentication token:', error);
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

export default axiosInstance;
