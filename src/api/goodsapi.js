import api from '../api';

// 获取商品列表
export const fetchGoodss = async (params) => {
  try {
    const response = await api.get('/Sellthing/SelectSellthingAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加商品
export const addGoods = async (data) => {
  try {
    const response = await api.post('/Sellthing/InsertSellthing', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新商品
export const updateGoods = async (data) => {
  try {
    const response = await api.post(`/Sellthing/UpdateSellthing`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除商品
export const deleteGoods = async (data) => {
  try {
    const response = await api.post(`/Sellthing/DeleteSellthing`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};