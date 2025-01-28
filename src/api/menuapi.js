import api from '../api';

// 获取菜单列表
export const fetchMenus = async () => {
  try {
    const response = await api.get('/api/Menu/BuildMenuAll'); // 修改为你的实际API路径
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
};

// 创建新菜单项
export const createMenu = async (menu) => {
  try {
    const response = await api.post('/menu', menu);
    return response.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

// 获取单个菜单项
export const fetchMenu = async (id) => {
  try {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu with id ${id}:`, error);
    throw error;
  }
};

// 更新菜单项
export const updateMenu = async (id, menu) => {
  try {
    const response = await api.put(`/menu/${id}`, menu);
    return response.data;
  } catch (error) {
    console.error(`Error updating menu with id ${id}:`, error);
    throw error;
  }
};

// 删除菜单项
export const deleteMenu = async (id) => {
  try {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu with id ${id}:`, error);
    throw error;
  }
};
