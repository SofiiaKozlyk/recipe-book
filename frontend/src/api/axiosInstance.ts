import axios from "axios";
import { history } from './navigate';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
  });
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        history.push('/login');  
      }
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;