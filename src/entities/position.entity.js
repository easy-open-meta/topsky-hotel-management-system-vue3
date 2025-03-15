import { BaseFields, BaseInitialValues } from './common.entity';

export const PositionSpecificFields = {
    ID: 'Id',
    NUMBER: 'PositionNumber',
    NAME: 'PositionName'
  };

  export const PositionFields = {
    ...PositionSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [PositionFields.NUMBER]: null,
    [PositionFields.NAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.positionNo'),
      dataIndex: PositionFields.NUMBER,
      key: PositionFields.NUMBER,
      sorter: (a, b) => a[PositionFields.NUMBER].localeCompare(b[PositionFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.positionName'),
      dataIndex: PositionFields.NAME,
      key: PositionFields.NAME
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [PositionFields.NAME]: [
      { required: true, message: t('message.pleaseInputPositionName'), trigger: 'blur' }
    ]
  });