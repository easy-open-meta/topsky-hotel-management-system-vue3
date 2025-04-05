import { BaseFields, BaseInitialValues } from './common.entity';

export const AdministratorSpecificFields = {
  NUMBER: 'Number',
  ACCOUNT: 'Account',
  PASSWORD: 'Password',
  TYPE: 'Type',
  TYPENAME: 'TypeName',
  NAME: 'Name',
  ISSUPERADMIN: 'IsSuperAdmin',
  ISSUPERADMINDESCRIPTION: 'IsSuperAdminDescription',
  ORIGINALPASSWORD: 'OriginalPassword',
};

export const AdministratorFields = {
  ...AdministratorSpecificFields,
  ...BaseFields
};

export const SuperAdmin = {
  YES: 1,
  NO: 0
};

export const initialFormValues = {
  ...BaseInitialValues,
    [AdministratorFields.NAME]: null,
    [AdministratorFields.NUMBER]: null,
    [AdministratorFields.ACCOUNT]: null,
    [AdministratorFields.PASSWORD]: null,
    [AdministratorFields.TYPE]: null,
    [AdministratorFields.ISSUPERADMIN]: null,
    [AdministratorFields.ORIGINALPASSWORD]: null,
};

export const getColumns = (t) => [
  {
    title: t('message.adminNumber'),
    dataIndex: AdministratorFields.NUMBER,
    key: AdministratorFields.NUMBER,
    sorter: (a, b) => a[AdministratorFields.NUMBER].localeCompare(b[AdministratorFields.NUMBER]),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.adminName'),
    dataIndex: AdministratorFields.NAME,
    key: AdministratorFields.NAME
  },
  {
    title: t('message.adminAccount'),
    dataIndex: AdministratorFields.ACCOUNT,
    key: AdministratorFields.ACCOUNT
  },
  {
    title: t('message.adminType'),
    dataIndex: AdministratorFields.TYPE,
    key: AdministratorFields.TYPE,
    hidden: true
  },
  {
    title: t('message.adminType'),
    dataIndex: AdministratorFields.TYPENAME,
    key: AdministratorFields.TYPENAME
  },
  {
    title: t('message.adminPassword'),
    dataIndex: AdministratorFields.PASSWORD,
    key: AdministratorFields.PASSWORD,
    hidden: true
  },
  {
    title: t('message.isSuperAdminFlag'),
    dataIndex: AdministratorFields.ISSUPERADMIN,
    key: AdministratorFields.ISSUPERADMIN,
    hidden: true
  },
  {
    title: t('message.isSuperAdminFlag'),
    dataIndex: AdministratorFields.ISSUPERADMINDESCRIPTION,
    key: AdministratorFields.ISSUPERADMINDESCRIPTION,
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t, isEditMode = false) => ({
    [AdministratorFields.NAME]: [
    { 
        required: true,
        message: t('message.pleaseInputAdminName', { field: t('message.adminNumber') }),
        trigger: 'blur',
        whitespace: true
    }
    ],
    [AdministratorFields.NUMBER]: [
        {
        required: true,
        message: t('message.pleaseInputAdminNumber', { field: t('message.adminName') }),
        trigger: 'blur',
        whitespace: true
        }
    ],
    [AdministratorFields.ACCOUNT]: [
        {
        required: true,
        message: t('message.pleaseInputAdminAccount', { field: t('message.adminAccount') }),
        trigger: 'blur',
        whitespace: true
        }
    ],
    [AdministratorFields.PASSWORD]: [
      {
        required: !isEditMode,
        message: t('message.pleaseInputAdminPassword')
      }
    ],
    [AdministratorFields.TYPE]: [
        {
        required: true,
        message: t('message.pleaseInputAdminType', { field: t('message.adminType') }),
        trigger: 'change'
        }
    ],
    [AdministratorFields.ISSUPERADMIN]: [
        {
        required: true,
        message: t('message.pleaseInputSuperAdminFlag', { field: t('message.isSuperAdminFlag') }),
        trigger: 'change'
        }
    ]
});