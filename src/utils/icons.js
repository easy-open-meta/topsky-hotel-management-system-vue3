// src/utils/icons.js
import {
  SyncOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  EllipsisOutlined,
  EyeOutlined,
  StopOutlined,
  RetweetOutlined
} from '@ant-design/icons-vue';

export function registerAntdIcons(app) {
  app.component('SyncOutlined', SyncOutlined);
  app.component('PlusOutlined', PlusOutlined);
  app.component('EditOutlined', EditOutlined);
  app.component('DeleteOutlined', DeleteOutlined);
  app.component('SearchOutlined', SearchOutlined);
  app.component('CaretUpOutlined', CaretUpOutlined);
  app.component('CaretDownOutlined', CaretDownOutlined);
  app.component('EllipsisOutlined', EllipsisOutlined);
  app.component('EyeOutlined', EyeOutlined);
  app.component('StopOutlined', StopOutlined);
  app.component('RetweetOutlined', RetweetOutlined);
}