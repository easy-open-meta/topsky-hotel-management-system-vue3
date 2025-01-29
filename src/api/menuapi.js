import api from '../api';

// 获取菜单树
export const fetchMenusTree = async () => {
  try {
    const response = await api.get('/api/Menu/BuildMenuAll');
    return response.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
};

// 创建新菜单项
export const createMenu = async (menu) => {
  try {
    const response = await api.post('/api/Menu/InsertMenu', menu);
    return response.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

// 更新菜单项
export const updateMenu = async (menu) => {
  try {
    const response = await api.put(`/api/Menu/UpdateMenu`, menu);
    return response.data;
  } catch (error) {
    console.error(`Error updating menu with id ${id}:`, error);
    throw error;
  }
};

// 删除菜单项
export const deleteMenu = async (menu) => {
  try {
    const response = await api.delete(`/api/Menu/DeleteMenu`,menu);
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu with id ${id}:`, error);
    throw error;
  }
};
