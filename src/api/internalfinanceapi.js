import api from '../api';

// 获取资产列表
export const fetchInternalFinances = async (params) => {
  try {
    const response = await api.get('/Cash/SelectCashInfoAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加资产
export const addInternalFinance = async (data) => {
  try {
    const response = await api.post('/Cash/AddCashInfo', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新资产
export const updateInternalFinance = async (data) => {
  try {
    const response = await api.post(`/Cash/UpdCashInfo`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除资产
export const deleteInternalFinance = async (data) => {
  try {
    const response = await api.post(`/Cash/DelCashInfo`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
