import api from '../api';

// 获取会员规则列表
export const fetchVipRules = async (params) => {
  try {
    const response = await api.get('/VipRule/SelectVipRuleList', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 添加会员规则
export const addVipRule = async (data) => {
  try {
    const response = await api.post('/VipRule/AddVipRule', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新会员规则
export const updateVipRule = async (data) => {
  try {
    const response = await api.post(`/VipRule/UpdVipRule`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除会员规则
export const deleteVipRule = async (data) => {
  try {
    const response = await api.post(`/VipRule/DelVipRule`,data);
      return response.data;
  } catch (error) {
    throw error;
  }
};
