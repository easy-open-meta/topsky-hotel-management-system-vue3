import axios from 'axios';
import router from '../router';
import moment from 'moment';

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
      console.log(config.data);
      if (url.includes('/add') || url.includes('/insert')) {
        config.data.datains_usr = account;
        config.data.datains_date = moment().format('YYYY-MM-DD');
      } else if (url.includes('/upd') || url.includes('/update')) {
        config.data.datachg_usr = account;
        config.data.datachg_date = moment().format('YYYY-MM-DD');
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
