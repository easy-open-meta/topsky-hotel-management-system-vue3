import api from '../api';

// 获取部门列表
export const fetchDepartments = async (params) => {
  try {
    const response = await api.get('/api/Base/SelectDeptAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    throw error;
  }
};

// 添加部门
export const addDepartment = async (data) => {
  try {
    const response = await api.post('/api/Base/AddDept', data);
    return response.data;
  } catch (error) {
    console.error('Failed to add department:', error);
    throw error;
  }
};

// 更新部门
export const updateDepartment = async (data) => {
  try {
    const response = await api.post(`/api/Base/UpdDept`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update department:', error);
    throw error;
  }
};

// 删除部门
export const deleteDepartment = async (data) => {
  try {
    const response = await api.post(`/api/Base/DelDept`,data);
      return response.data;
  } catch (error) {
    console.error('Failed to delete department:', error);
    throw error;
  }
};
