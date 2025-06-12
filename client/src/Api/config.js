import axios from "axios";
import { useClerkAuth } from "@clerk/clerk-react";

const { getToken } = useClerkAuth();
const token = await getToken();

const headers = {
  "Content-Type": "application/json",
};

headers.Authorization = `Bearer ${token}`;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  withCredentials: true,
  headers: headers,
});

export default axiosInstance;
