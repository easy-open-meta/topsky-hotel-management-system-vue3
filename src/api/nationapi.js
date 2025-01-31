import api from '../api';

// 获取民族列表
export const fetchNations = async (params) => {
  try {
    const response = await api.get('/Base/SelectNationAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Nations:', error);
    throw error;
  }
};

// 添加民族
export const addNation = async (data) => {
  try {
    const response = await api.post('/Base/AddNation', data);
    return response.data;
  } catch (error) {
    console.error('Failed to add Nation:', error);
    throw error;
  }
};

// 更新民族
export const updateNation = async (data) => {
  try {
    const response = await api.post(`/Base/UpdNation`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update Nation:', error);
    throw error;
  }
};

// 删除民族
export const deleteNation = async (data) => {
  try {
    const response = await api.post(`/Base/DelNation`,data);
      return response.data;
  } catch (error) {
    console.error('Failed to delete Nation:', error);
    throw error;
  }
};
