import api from '../api';

// 获取监管统计列表
export const fetchSupervisionInfos = async (params) => {
  try {
    const response = await api.get('/SupervisionStatistics/SelectSupervisionStatisticsAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加监管统计
export const addSupervisionInfo = async (data) => {
  try {
    const response = await api.post('/SupervisionStatistics/InsertSupervisionStatistics', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新监管统计
export const updateSupervisionInfo = async (data) => {
  try {
    const response = await api.post(`/SupervisionStatistics/UpdateSupervisionStatistics`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除监管统计
export const deleteSupervisionInfo = async (data) => {
  try {
    const response = await api.post(`/SupervisionStatistics/DeleteSupervisionStatistics`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
