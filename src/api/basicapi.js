import api from '../api';

// 登录
export const signIn = async (data) => {
  try {
    const response = await api.post('/Admin/Login', data);
    const resData = response.data;
    if (resData.StatusCode === 200) {
      return resData;
    } else {
       throw new Error(`Login failed with status code: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
