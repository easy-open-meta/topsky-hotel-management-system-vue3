import api from '../api';

// 获取房间类型列表
export const fetchRoomTypes = async (params) => {
  try {
    const response = await api.get('/RoomType/SelectRoomTypesAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加房间类型
export const addRoomType = async (data) => {
  try {
    const response = await api.post('/RoomType/InsertRoomType', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新房间类型
export const updateRoomType = async (data) => {
  try {
    const response = await api.post(`/RoomType/UpdateRoomType`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除房间类型
export const deleteRoomType = async (data) => {
  try {
    const response = await api.post(`/RoomType/DeleteRoomType`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};