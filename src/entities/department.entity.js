import { BaseFields, BaseInitialValues } from './common.entity';

export const DepartmentSpecificFields  = {
    ID: 'Id',
    NUMBER: 'DepartmentNumber',
    NAME: 'DepartmentName',
    DESCRIPTION: 'DepartmentDescription',
    CREATIONDATE: 'DepartmentCreationDate',
    LEADER: 'DepartmentLeader',
    LEADERNAME: 'LeaderName',
    PARENT: 'ParentDepartmentNumber',
    PARENTNAME: 'ParentDepartmentName'
  };

  export const DepartmentFields = {
    ...DepartmentSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [DepartmentFields.NUMBER]: null,
    [DepartmentFields.NAME]: '',
    [DepartmentFields.DESCRIPTION]: '',
    [DepartmentFields.CREATIONDATE]: null,
    [DepartmentFields.LEADER]: '',
    [DepartmentFields.LEADERNAME]: '',
    [DepartmentFields.PARENT]: '',
    [DepartmentFields.PARENTNAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.departmentNo'),
      dataIndex: DepartmentFields.NUMBER,
      key: DepartmentFields.NUMBER,
      sorter: (a, b) => a[DepartmentFields.NUMBER].localeCompare(b[DepartmentFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.departmentName'),
      dataIndex: DepartmentFields.NAME,
      key: DepartmentFields.NAME
    },
    {
      title: t('message.departmentDesc'),
      dataIndex: DepartmentFields.DESCRIPTION,
      key: DepartmentFields.DESCRIPTION,
    },
    {
      title: t('message.departmentLeader'),
      dataIndex: DepartmentFields.LEADERNAME,
      key: DepartmentFields.LEADERNAME,
    },
    {
      title: t('message.departmentParent'),
      dataIndex: DepartmentFields.PARENTNAME,
      key: DepartmentFields.PARENTNAME,
    },
    {
      title: t('message.departmentDate'),
      dataIndex: DepartmentFields.CREATIONDATE,
      key: DepartmentFields.CREATIONDATE,
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [DepartmentFields.NAME]: [
      { required: true, message: t('message.pleaseInputDepartmentName'), trigger: 'blur' }
    ]
  });