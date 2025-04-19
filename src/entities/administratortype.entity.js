import { BaseFields, BaseInitialValues } from './common.entity';

export const AdministratorTypeSpecificFields = {
  NUMBER: 'TypeId',
  NAME: 'TypeName'
};

export const AdministratorTypeFields = {
  ...AdministratorTypeSpecificFields,
  ...BaseFields
};

export const initialFormValues = {
  ...BaseInitialValues,
    [AdministratorTypeFields.NAME]: '',
    [AdministratorTypeFields.NUMBER]: '',
};

export const getColumns = (t) => [
  {
    title: t('message.adminTypeNumber'),
    dataIndex: AdministratorTypeFields.NUMBER,
    key: AdministratorTypeFields.NUMBER,
    sorter: (a, b) => a[AdministratorTypeFields.NUMBER].localeCompare(b[AdministratorTypeFields.NUMBER]),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.adminTypeName'),
    dataIndex: AdministratorTypeFields.NAME,
    key: AdministratorTypeFields.NAME,
    sorter: (a, b) => a[AdministratorTypeFields.NAME].localeCompare(b[AdministratorTypeFields.NAME])
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t) => ({
    [AdministratorTypeFields.NAME]: [
    { 
        required: true,
        message: t('message.pleaseInputAdminTypeName', { field: t('message.adminTypeNumber') }),
        trigger: 'blur',
        whitespace: true
    }
    ],
    [AdministratorTypeFields.NUMBER]: [
        {
        required: true,
        message: t('message.pleaseInputAdminTypeNumber', { field: t('message.adminTypeName') }),
        trigger: 'blur',
        whitespace: true
        }
    ]
});