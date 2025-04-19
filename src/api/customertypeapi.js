import api from '../api';

// 获取客户类型列表
export const fetchCustomerTypes = async (params) => {
  try {
    const response = await api.get('/Base/SelectCustoTypeAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加客户类型
export const addCustomerType = async (data) => {
  try {
    const response = await api.post('/Base/InsertCustoType', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新客户类型
export const updateCustomerType = async (data) => {
  try {
    const response = await api.post(`/Base/UpdateCustoType`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除客户类型
export const deleteCustomerType = async (data) => {
  try {
    const response = await api.post(`/Base/DeleteCustoType`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
