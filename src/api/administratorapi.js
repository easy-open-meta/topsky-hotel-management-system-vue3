import api from '../api';

// 获取管理员列表
export const fetchAdmins = async (params) => {
  try {
    const response = await api.get('/Admin/GetAllAdminList', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加管理员
export const addAdmin = async (data) => {
  try {
    const response = await api.post('/Admin/AddAdmin', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新管理员
export const updateAdmin = async (data) => {
  try {
    const response = await api.post(`/Admin/UpdAdmin`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除管理员
export const deleteAdmin = async (data) => {
  try {
    const response = await api.post(`/Admin/DelAdmin`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
