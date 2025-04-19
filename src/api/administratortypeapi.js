import api from '../api';

// 获取管理员类型列表
export const fetchAdminTypes = async (params) => {
  try {
    const response = await api.get('/Admin/GetAllAdminTypes', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加管理员类型
export const addAdminType = async (data) => {
  try {
    const response = await api.post('/Admin/AddAdminType', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新管理员类型
export const updateAdminType = async (data) => {
  try {
    const response = await api.post(`/Admin/UpdAdminType`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除管理员类型
export const deleteAdminType = async (data) => {
  try {
    const response = await api.post(`/Admin/DelAdminType`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
