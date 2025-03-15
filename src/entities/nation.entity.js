import { BaseFields, BaseInitialValues } from './common.entity';

export const NationSpecificFields = {
    ID: 'Id',
    NUMBER: 'NationNumber',
    NAME: 'NationName'
  };
  
  export const NationFields = {
    ...NationSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [NationFields.NUMBER]: null,
    [NationFields.NAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.nationNo'),
      dataIndex: NationFields.NUMBER,
      key: NationFields.NUMBER,
      sorter: (a, b) => a[NationFields.NUMBER].localeCompare(b[NationFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.nationName'),
      dataIndex: NationFields.NAME,
      key: NationFields.NAME
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [NationFields.NAME]: [
      { required: true, message: t('message.pleaseInputNationName'), trigger: 'blur' }
    ]
  });