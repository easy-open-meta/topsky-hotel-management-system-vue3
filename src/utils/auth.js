import { jwtDecode } from 'jwt-decode';
import router from '../router';

export function checkTokenValidity() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (!token) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/signin');
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      router.push('/signin');
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/signin');
    return false;
  }
}
