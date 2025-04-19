import api from '../api';

// 获取房间状态列表
export const fetchRoomStates = async () => {
  try {
    const response = await api.get('/Base/SelectRoomStateAll');
    return response.data;
  } catch (error) {
    throw error;
  }
};