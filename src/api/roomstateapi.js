import api from '../api';

// 获取房间状态列表
export const fetchRoomStates = async (params) => {
  try {
    const response = await api.get('/Room/SelectRoomStateAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};