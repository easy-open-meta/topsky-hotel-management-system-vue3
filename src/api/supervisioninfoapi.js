import api from '../api';

// 获取监管统计列表
export const fetchSupervisionInfos = async (params) => {
  try {
    const response = await api.get('/CheckInfo/SelectCheckInfoAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch SupervisionInfo:', error);
    throw error;
  }
};

// 添加监管统计
export const addSupervisionInfo = async (data) => {
  try {
    const response = await api.post('/CheckInfo/InsertCheckInfo', data);
    return response.data;
  } catch (error) {
    console.error('Failed to add SupervisionInfo:', error);
    throw error;
  }
};

// 更新监管统计
export const updateSupervisionInfo = async (data) => {
  try {
    const response = await api.post(`/CheckInfo/UpdateCheckInfo`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update SupervisionInfo:', error);
    throw error;
  }
};

// 删除监管统计
export const deleteSupervisionInfo = async (data) => {
  try {
    const response = await api.post(`/CheckInfo/DeleteCheckInfo`,data);
      return response.data;
  } catch (error) {
    console.error('Failed to delete SupervisionInfo:', error);
    throw error;
  }
};
