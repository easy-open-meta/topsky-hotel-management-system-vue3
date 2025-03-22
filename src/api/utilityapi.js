import api from '../api';

// 获取操作日志列表
export const fetchOperationlogs = async (params) => {
  try {
    const response = await api.get('/Utility/SelectOperationlogAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取身份证地区代码
export const fetchCardCode = async (params) => {
  try {
    const response = await api.get('/Utility/SelectCardCode', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
