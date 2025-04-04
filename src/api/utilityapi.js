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

// 删除时间段内的操作日志
export const deleteOperationlogByRange = async (operationlog) => {
  try {
    const response = await api.post('/Utility/DeleteOperationlogByRange', operationlog);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 删除单条操作日志
export const deleteOperationlog = async (operationlog) => {
  try {
    const response = await api.post('/Utility/DeleteOperationlog', operationlog);
    return response.data;
  } catch (error) {
    throw error;
  }
}