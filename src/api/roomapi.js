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

// 添加房间
export const addRoom = async (data) => {
  try {
    const response = await api.post('/Room/InsertRoom', data);
    return response.data;
  } catch (error) {
    console.error('Failed to add room:', error);
    throw error;
  }
};

// 更新房间
export const updateRoom = async (data) => {
  try {
    const response = await api.post(`/Room/UpdateRoom`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update room:', error);
    throw error;
  }
};

// 删除房间
export const deleteRoom = async (data) => {
  try {
    const response = await api.post(`/Room/DeleteRoom`,data);
      return response.data;
  } catch (error) {
    console.error('Failed to delete room:', error);
    throw error;
  }
};