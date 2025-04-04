import api from '../api';

// 获取菜单树
export const fetchMenusTree = async (menu) => {
  try {
    const response = await api.post('/Menu/BuildMenuAll',menu);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 创建新菜单项
export const createMenu = async (menu) => {
  try {
    const response = await api.post('/Menu/InsertMenu', menu);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新菜单项
export const updateMenu = async (menu) => {
  try {
    const response = await api.put(`/Menu/UpdateMenu`, menu);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除菜单项
export const deleteMenu = async (menu) => {
  try {
    const response = await api.delete(`/Menu/DeleteMenu`,menu);
    return response.data;
  } catch (error) {
    throw error;
  }
};
