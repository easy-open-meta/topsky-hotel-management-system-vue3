import { BaseFields, BaseInitialValues } from './common.entity';

export const RoleSpecificFields = {
    ID: 'Id',
    NUMBER: 'RoleNumber',
    NAME: 'RoleName',
    DESCRIPTION: 'RoleDescription',
  };
  
  export const RoleFields = {
    ...RoleSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [RoleFields.NUMBER]: null,
    [RoleFields.NAME]: '',
    [RoleFields.DESCRIPTION]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.roleNumber'),
      dataIndex: RoleFields.NUMBER,
      key: RoleFields.NUMBER,
      sorter: (a, b) => a[RoleFields.NUMBER].localeCompare(b[RoleFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.roleName'),
      dataIndex: RoleFields.NAME,
      key: RoleFields.NAME
    },
    {
      title: t('message.roleDescription'),
      dataIndex: RoleFields.DESCRIPTION,
      key: RoleFields.DESCRIPTION
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [RoleFields.NAME]: [
      { required: true, message: t('message.pleaseInputRoleName'), trigger: 'blur' }
    ]
  });