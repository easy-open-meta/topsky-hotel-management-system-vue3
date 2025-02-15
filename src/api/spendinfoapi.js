import api from '../api';

// 获取消费信息列表
export const fetchSpendInfos = async (params) => {
  try {
    const response = await api.get('/Spend/SelectSpendInfoAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加消费信息
export const addSpendInfo = async (data) => {
  try {
    const response = await api.post('/Spend/InsertSpendInfo', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新消费信息
export const updateSpendInfo = async (data) => {
  try {
    const response = await api.post(`/Spend/UpdSpendInfo`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};