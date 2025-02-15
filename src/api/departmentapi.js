import api from '../api';

// 获取部门列表
export const fetchDepartments = async (params) => {
  try {
    const response = await api.get('/Base/SelectDeptAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加部门
export const addDepartment = async (data) => {
  try {
    const response = await api.post('/Base/AddDept', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新部门
export const updateDepartment = async (data) => {
  try {
    const response = await api.post(`/Base/UpdDept`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除部门
export const deleteDepartment = async (data) => {
  try {
    const response = await api.post(`/Base/DelDept`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
