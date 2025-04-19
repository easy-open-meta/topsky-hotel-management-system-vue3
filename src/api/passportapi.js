import api from '../api';

// 获取证件类型列表
export const fetchPassports = async (params) => {
  try {
    const response = await api.get('/Base/SelectPassPortTypeAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取可用证件类型列表
export const fetchCanUsePassports = async (params) => {
  try {
    const response = await api.get('/Base/SelectPassPortTypeAllCanUse', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加证件类型
export const addPassport = async (data) => {
  try {
    const response = await api.post('/Base/InsertPassPortType', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新证件类型
export const updatePassport = async (data) => {
  try {
    const response = await api.post(`/Base/UpdatePassPortType`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除证件类型
export const deletePassport = async (data) => {
  try {
    const response = await api.post(`/Base/DeletePassPortType`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
