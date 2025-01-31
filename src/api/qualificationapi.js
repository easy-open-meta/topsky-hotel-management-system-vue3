import api from '../api';

// 获取学历列表
export const fetchQualifications = async (params) => {
  try {
    const response = await api.get('/Base/SelectEducationAll', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Qualifications:', error);
    throw error;
  }
};

// 添加学历
export const addQualification = async (data) => {
  try {
    const response = await api.post('/Base/AddEducation', data);
    return response.data;
  } catch (error) {
    console.error('Failed to add Qualification:', error);
    throw error;
  }
};

// 更新学历
export const updateQualification = async (data) => {
  try {
    const response = await api.post(`/Base/UpdEducation`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update Qualification:', error);
    throw error;
  }
};

// 删除学历
export const deleteQualification = async (data) => {
  try {
    const response = await api.post(`/Base/DelEducation`,data);
      return response.data;
  } catch (error) {
    console.error('Failed to delete Qualification:', error);
    throw error;
  }
};
