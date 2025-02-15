import api from '../api';

// 获取客户列表
export const fetchCustomers = async (params) => {
  try {
    const response = await api.get('/Custo/SelectCustomers', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加客户
export const addCustomer = async (data) => {
  try {
    const response = await api.post('/Custo/InsertCustomerInfo', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新客户
export const updateCustomer = async (data) => {
  try {
    const response = await api.post(`/Custo/UpdCustomerInfo`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除客户
export const deleteCustomer = async (data) => {
  try {
    const response = await api.post(`/Custo/DelCustomerInfo`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
