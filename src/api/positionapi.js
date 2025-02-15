import api from '../api';

// 获取职位列表
export const fetchPositions = async (params) => {
  try {
    const response = await api.get('/Base/SelectPositionAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加职位
export const addPosition = async (data) => {
  try {
    const response = await api.post('/Base/AddPosition', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新职位
export const updatePosition = async (data) => {
  try {
    const response = await api.post(`/Base/UpdPosition`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除职位
export const deletePosition = async (data) => {
  try {
    const response = await api.post(`/Base/DelPosition`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
