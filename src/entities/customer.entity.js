import { BaseFields, BaseInitialValues } from './common.entity';

export const CustomerSpecificFields = {
  ID: 'CustomerNumber',
  NAME: 'CustomerName',
  GENDER: 'CustomerGender',
  GENDER_NAME: 'GenderName',
  BIRTH_DATE: 'DateOfBirth',
  TYPE: 'CustomerType',
  TYPE_NAME: 'CustomerTypeName',
  PASSPORTTYPE: 'PassportId',
  PASSPORTNAME: 'PassportName',
  ID_NUMBER: 'IdCardNumber',
  PHONE: 'CustomerPhoneNumber',
  ADDRESS: 'CustomerAddress'
};

export const CustomerFields = {
  ...CustomerSpecificFields,
  ...BaseFields
};

export const Gender = {
  MALE: 1,
  FEMALE: 0
};

export const DATE_FORMAT = 'YYYY-MM-DD';

export const initialFormValues = {
  ...BaseInitialValues,
  [CustomerFields.ID]: null,
  [CustomerFields.NAME]: '',
  [CustomerFields.GENDER]: null,
  [CustomerFields.BIRTH_DATE]: null,
  [CustomerFields.TYPE]: null,
  [CustomerFields.PASSPORTTYPE]: null,
  [CustomerFields.PASSPORTNAME]: '',
  [CustomerFields.ID_NUMBER]: '',
  [CustomerFields.PHONE]: '',
  [CustomerFields.ADDRESS]: ''
};

export const getColumns = (t) => [
  {
    title: t('message.customerNo'),
    dataIndex: CustomerFields.ID,
    key: CustomerFields.ID,
    sorter: (a, b) => a[CustomerFields.ID].localeCompare(b[CustomerFields.ID]),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.customerName'),
    dataIndex: CustomerFields.NAME,
    key: CustomerFields.NAME,
    sorter: (a, b) => a[CustomerFields.NAME].localeCompare(b[CustomerFields.NAME])
  },
  {
    title: t('message.customerSex'),
    dataIndex: CustomerFields.GENDER_NAME,
    key: CustomerFields.GENDER_NAME
  },
  {
    title: t('message.customerBirth'),
    dataIndex: CustomerFields.BIRTH_DATE,
    key: CustomerFields.BIRTH_DATE
  },
  {
    title: t('message.customerType'),
    dataIndex: CustomerFields.TYPE,
    key: CustomerFields.TYPE,
    hidden: true
  },
  {
    title: t('message.customerType'),
    dataIndex: CustomerFields.TYPE_NAME,
    key: CustomerFields.TYPE_NAME
  },
  {
    title: t('message.customerPassportType'),
    dataIndex: CustomerFields.PASSPORTTYPE,
    key: CustomerFields.PASSPORTTYPE,
    hidden: true
  },
  {
    title: t('message.customerPassportType'),
    dataIndex: CustomerFields.PASSPORTNAME,
    key: CustomerFields.PASSPORTNAME
  },
  {
    title: t('message.customerPassportID'),
    dataIndex: CustomerFields.ID_NUMBER,
    key: CustomerFields.ID_NUMBER
  },
  {
    title: t('message.customerTel'),
    dataIndex: CustomerFields.PHONE,
    key: CustomerFields.PHONE
  },
  {
    title: t('message.customerAddress'),
    dataIndex: CustomerFields.ADDRESS,
    key: CustomerFields.ADDRESS
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t) => ({
  [CustomerFields.NAME]: [
    { 
      required: true,
      message: t('message.pleaseInputCustomerName', { field: t('message.customerName') }),
      trigger: 'blur',
      whitespace: true
    }
  ],
  [CustomerFields.GENDER]: [
    { 
      required: true,
      message: t('message.pleaseInputCustomerSex', { field: t('message.customerSex') }),
      trigger: 'change'
    }
  ],
  [CustomerFields.PHONE]: [
    { 
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: t('message.invalidPhone'),
      trigger: 'blur'
    }
  ],
  [CustomerFields.ID_NUMBER]: [
    { 
      required: true,
      len: 18,
      pattern: /^\d{17}[\dXx]$/,
      message: t('message.invalidIdNumber'),
      trigger: 'blur'
    }
  ]
});