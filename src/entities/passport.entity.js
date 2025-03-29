import { BaseFields, BaseInitialValues } from './common.entity';

export const PassportSpecificFields = {
    NUMBER: 'PassportId',
    NAME: 'PassportName'
  };
  
  export const PassportFields = {
    ...PassportSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [PassportFields.NUMBER]: null,
    [PassportFields.NAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.passportNo'),
      dataIndex: PassportFields.NUMBER,
      key: PassportFields.NUMBER,
      sorter: (a, b) => a[PassportFields.NUMBER].localeCompare(b[PassportFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.passportName'),
      dataIndex: PassportFields.NAME,
      key: PassportFields.NAME
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [PassportFields.NAME]: [
      { required: true, message: t('message.pleaseInputPassportName'), trigger: 'blur' }
    ]
  });