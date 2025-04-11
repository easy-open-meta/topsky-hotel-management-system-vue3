import api from '../api';

// 获取角色列表
export const fetchRoles = async (params) => {
  try {
    const response = await api.get('/Role/SelectRoleList', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加角色
export const addRole = async (data) => {
  try {
    const response = await api.post('/Role/InsertRole', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新角色
export const updateRole = async (data) => {
  try {
    const response = await api.post(`/Role/UpdateRole`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除角色
export const deleteRole = async (data) => {
  try {
    const response = await api.post(`/Role/DeleteRole`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
