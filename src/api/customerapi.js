import api from '../api';

// 获取客户列表
export const fetchCustomers = async (params) => {
  try {
    const response = await api.get('/Custo/SelectCustoAll', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};