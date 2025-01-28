import api from '../api'

// 登录
export const signIn = async (data) => {
  try {
    const response = await api.post('/api/Admin/SelectManagerByPass', data);
    return response.data;
  } catch (error) {
    console.error('SignIn error:', error);
    throw error;
  }
};
