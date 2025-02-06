import api from '../api';

// 获取房间类型列表
export const fetchRoomTypes = async (params) => {
  try {
    const response = await api.get('/RoomType/SelectRoomTypesAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch types:', error);
    throw error;
  }
};