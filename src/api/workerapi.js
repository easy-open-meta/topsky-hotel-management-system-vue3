import api from '../api';

// 获取员工列表
export const fetchWorkers = async (params) => {
  try {
    const response = await api.get('/Worker/SelectWorkerAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch workers:', error);
    throw error;
  }
};

// 添加员工
export const addWorker = async (data) => {
  try {
    const response = await api.post('/Worker/AddWorker', data);
    return response.data;
  } catch (error) {
    console.error('Failed to add worker:', error);
    throw error;
  }
};

// 更新员工
export const updateWorker = async (data) => {
  try {
    const response = await api.post(`/Worker/UpdateWorker`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update worker:', error);
    throw error;
  }
};
