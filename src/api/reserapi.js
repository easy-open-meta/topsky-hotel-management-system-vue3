import api from '../api';

// 获取预约列表
export const fetchResers = async (params) => {
  try {
    const response = await api.get('/Reser/SelectReserAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加预约
export const addReser = async (data) => {
  try {
    const response = await api.post('/Reser/InserReserInfo', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新预约
export const updateReser = async (data) => {
  try {
    const response = await api.post(`/Reser/UpdateReserInfo`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除预约
export const deleteReser = async (data) => {
  try {
    const response = await api.post(`/Reser/DeleteReserInfo`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
