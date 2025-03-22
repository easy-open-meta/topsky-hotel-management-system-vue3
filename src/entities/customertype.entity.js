import { BaseFields, BaseInitialValues } from './common.entity';

export const CustomerTypeSpecificFields = {
    NUMBER: 'CustomerType',
    NAME: 'CustomerTypeName'
  };
  
  export const CustomerTypeFields = {
    ...CustomerTypeSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [CustomerTypeFields.NUMBER]: null,
    [CustomerTypeFields.NAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.customerTypeNo'),
      dataIndex: CustomerTypeFields.NUMBER,
      key: CustomerTypeFields.NUMBER,
      sorter: (a, b) => {
        const idA = parseInt(a[CustomerTypeFields.TYPE_ID], 10) || 0;
        const idB = parseInt(b[CustomerTypeFields.TYPE_ID], 10) || 0;
        return idA - idB;
      },
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.customerTypeName'),
      dataIndex: CustomerTypeFields.NAME,
      key: CustomerTypeFields.NAME
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [CustomerTypeFields.NAME]: [
      { required: true, message: t('message.pleaseInputCustomerTypeName'), trigger: 'blur' }
    ]
  });