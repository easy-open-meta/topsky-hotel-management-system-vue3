import api from '../api';

// 获取房间列表
export const fetchRooms = async (params) => {
  try {
    const response = await api.get('/Room/SelectRoomAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error;
  }
};