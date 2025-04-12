import { BaseFields, BaseInitialValues } from './common.entity';

export const MenuSpecificFields = {
    ID: 'Id',
    KEY: 'Key',
    TITLE: 'Title',
    PATH: 'Path',
    PARENT: 'Parent',
    SEARCHPARENT: 'SearchParent',
    ICON: 'Icon',
  };
  
  export const MenuFields = {
    ...MenuSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [MenuFields.KEY]: null,
    [MenuFields.TITLE]: '',
    [MenuFields.PATH]: '',
    [MenuFields.PARENT]: null,
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.menuId'),
      dataIndex: MenuFields.ID,
      key: MenuFields.ID
    },
    {
      title: t('message.menuKey'),
      dataIndex: MenuFields.KEY,
      key: MenuFields.KEY,
    },
    {
      title: t('message.menuTitle'),
      dataIndex: MenuFields.TITLE,
      key: MenuFields.TITLE
    },
    {
      title: t('message.menuPath'),
      dataIndex: MenuFields.PATH,
      key: MenuFields.PATH
    },
    {
      title: t('message.menuParent'),
      dataIndex: MenuFields.PARENT,
      key: MenuFields.PARENT
    },
    {
      title: t('message.menuIcon'),
      dataIndex: MenuFields.ICON,
      key: MenuFields.ICON
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [MenuFields.KEY]: [
      { required: true, message: t('message.pleaseInputMenuKey'), trigger: 'blur' }
    ],
    [MenuFields.TITLE]: [
      { required: true, message: t('message.pleaseInputMenuTitle'), trigger: 'blur' }
    ],
    [MenuFields.PATH]: [
      { required: true, message: t('message.pleaseInputMenuPath'), trigger: 'blur' }
    ],
  });