import api from '../api';

// 获取面貌列表
export const fetchWorkerFeatures = async (params) => {
  try {
    const response = await api.get('/Base/SelectWorkerFeatureAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
