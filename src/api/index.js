import axios from 'axios';
import router from '../router';
import dayjs from 'dayjs';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (account && config.data) {
      let url = config.url.toLowerCase();
      url = url.replace(config.baseURL.toLowerCase(), '');
      if (url.includes('/add') || url.includes('/insert')) {
        config.data.DataInsUsr = account;
        config.data.DataInsDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      } else if (url.includes('/upd') || url.includes('/update')) {
        config.data.DataChgUsr = account;
        config.data.DataChgDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('account');
      window.$notification('error', '登录过期', '请重新登录');
      router.push('/signin');
      return Promise.reject(error);
  }
  return Promise.reject(error);
  }
);

export default api;
