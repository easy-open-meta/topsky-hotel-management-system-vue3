import axios from 'axios';
import config from '@/config';

const api = axios.create({
    baseURL: config.API_URL,
    timeout: 10000,
});

const pendingRequests = new Map();

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        showError('Token 已过期，请重新登录。');
        localStorage.removeItem('token');
        window.location.href = '/admin/login.html';
        return Promise.reject(new Error('Token expired'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    const requestKey = `${config.method}:${config.url}`;
    if (pendingRequests.has(requestKey)) {
      showError('Duplicate request detected:', requestKey);
      return Promise.reject(new Error('Duplicate request'));
    }
    pendingRequests.set(requestKey, true);

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const requestKey = `${response.config.method}:${response.config.url}`;
    pendingRequests.delete(requestKey);
    return response.data;
  },
  error => {
    const requestKey = `${error.config.method}:${error.config.url}`;
    pendingRequests.delete(requestKey);

    if (error.code === 'ECONNABORTED') {
      showError('Request Timeout: The server took too long to respond.');
    } else if (error.response) {
      const { status, data } = error.response;
      showError(`Response Error: Status ${status}`, data);

      if (status === 401) {
        showError('Session expired. Please log in again.');
      } else if (status === 403) {
        showError('Forbidden: You do not have permission to access this resource.');
      } else if (status === 500) {
        showError('Server Error: Something went wrong on the server.');
      }
    } else if (error.request) {
      showError('No response received:', error.request);
    } else {
      showError('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default service;

