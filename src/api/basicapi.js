import api from '../api';

// 登录
export const signIn = async (data) => {
  try {
    const response = await api.post('/Admin/Login', data);
    if (response.status === 200) {
      return response.data;
    } else {
       throw new Error(`Login failed with status code: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
