import api from '.';

// 获取员工列表
export const fetchEmployees = async (params) => {
  try {
    const response = await api.get('/Employee/SelectEmployeeAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加员工
export const addEmployee = async (data) => {
  try {
    const response = await api.post('/Employee/AddEmployee', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新员工
export const updateEmployee = async (data) => {
  try {
    const response = await api.post(`/Employee/UpdateEmployee`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
