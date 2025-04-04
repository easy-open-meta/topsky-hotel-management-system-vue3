import api from '../api';

// 获取员工列表
export const fetchEmployees = async (params) => {
  try {
    const response = await api.get('/Employee/SelectEmployeeAll', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//获取员工详情
export const fetchEmployeeDetail = async (params) => {
  try {
    const response = await api.get('/Employee/SelectEmployeeInfoByEmployeeId', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取员工简历
export const fetchEmployeeResume = async (params) => {
  try {
    const response = await api.get('/EmployeeHistory/SelectHistoryByEmployeeId', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加员工
export const addEmployee = async (data) => {
  try {
    const response = await api.post('/Employee/AddEmployee', data);
    console.log(data);
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

// 禁用/启用员工账号
export const managerEmployeeAccount = async (data) => {
  try {
    const response = await api.post(`/Employee/ManagerEmployeeAccount`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取奖惩记录
export const fetchEmployeeRewardPunishment = async (params) => {
  try {
    const response = await api.get('/RewardPunishment/SelectAllRewardPunishmentByEmployeeId', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取打卡记录
export const fetchEmployeeAttendance = async (params) => {
  try {
    const response = await api.get('/EmployeeCheck/SelectCheckInfoByEmployeeId', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 重置账号密码
export const resetEmployeePassword = async (data) => {
  try {
    const response = await api.post(`/Employee/ResetEmployeeAccountPassword`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
