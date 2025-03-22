import { BaseFields, BaseInitialValues } from './common.entity';

export const VipRuleSpecificFields = {
  ID: 'RuleSerialNumber',
  NAME: 'RuleName',
  VALUE: 'RuleValue',
  CUSTOMER_TYPE_ID: 'VipLevelId',
  CUSTOMER_TYPE_NAME: 'VipLevelName'
};

export const VipRuleFields = {
  ...VipRuleSpecificFields,
  ...BaseFields
};

export const initialFormValues = {
  ...BaseInitialValues,
  [VipRuleFields.ID]: null,
  [VipRuleFields.NAME]: '',
  [VipRuleFields.VALUE]: null,
  [VipRuleFields.CUSTOMER_TYPE_ID]: null
};

export const getColumns = (t) => [
  {
    title: t('message.vipRuleId'),
    dataIndex: VipRuleFields.ID,
    key: VipRuleFields.ID,
    sorter: (a, b) => a[VipRuleFields.ID].localeCompare(b[VipRuleFields.ID]),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.vipRuleName'),
    dataIndex: VipRuleFields.NAME,
    key: VipRuleFields.NAME,
    sorter: (a, b) => a[VipRuleFields.NAME].localeCompare(b[VipRuleFields.NAME])
  },
  {
    title: t('message.vipRuleValue'),
    dataIndex: VipRuleFields.VALUE,
    key: VipRuleFields.VALUE,
    align: 'right'
  },
  {
    title: t('message.vipRuleCustomerType'),
    dataIndex: VipRuleFields.CUSTOMER_TYPE_NAME,
    key: VipRuleFields.CUSTOMER_TYPE_NAME
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t) => ({
  [VipRuleFields.NAME]: [
    { required: true, message: t('message.pleaseInputVipRuleName'), trigger: 'blur' }
  ],
  [VipRuleFields.VALUE]: [
    { 
      required: true, 
      type: 'number', 
      min: 0, 
      message: t('message.pleaseInputValidAmount'), 
      trigger: 'blur' 
    }
  ],
  [VipRuleFields.CUSTOMER_TYPE_ID]: [
    { required: true, message: t('message.pleaseSelectCustomerType'), trigger: 'change' }
  ]
});