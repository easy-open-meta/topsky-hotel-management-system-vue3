import api from '../api';

// 根据条件查询水电费信息 房间号（可选）使用开始时间（可选）使用结束时间（可选）
export const fetchHydroelectricitys = async (params) => {
  try {
    const response = await api.get('/EnergyManagement/SelectEnergyManagementInfo', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加水电费信息
export const addHydroelectricity = async (data) => {
  try {
    const response = await api.post('/EnergyManagement/InsertEnergyManagementInfo', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新水电费信息
export const updateHydroelectricity = async (data) => {
  try {
    const response = await api.post(`/EnergyManagement/UpdateEnergyManagementInfo`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除水电费信息
export const deleteHydroelectricity = async (data) => {
  try {
    const response = await api.post(`/EnergyManagement/DeleteEnergyManagementInfo`, data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
