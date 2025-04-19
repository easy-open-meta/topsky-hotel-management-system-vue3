import { BaseFields, BaseInitialValues } from './common.entity';
import { formatDate } from '@/utils/index';

export const EmployeeRewardPunishmentSpecificFields  = {
    NUMBER: 'Id',
    EMPLOYEENUMBER: 'EmployeeId',
    TIME: 'RewardPunishmentTime',
    TYPE: 'RewardPunishmentType',
    TYPENAME: 'RewardPunishmentTypeName',
    INFO: 'RewardPunishmentInformation',
    OPERATOR: 'RewardPunishmentOperator',
    OPERATORNAME: 'OperatorName'
  };

  export const DATE_FORMATS = {
    SHORT_DATE: 'YYYY-MM-DD',
    LONG_DATE: 'MMMM Do YYYY',
    TABLE_DATE: 'MM/DD/YYYY'
  };

  export const EmployeeRewardPunishmentFields = {
    ...EmployeeRewardPunishmentSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [EmployeeRewardPunishmentFields.NUMBER]: null,
    [EmployeeRewardPunishmentFields.EMPLOYEENUMBER]: '',
    [EmployeeRewardPunishmentFields.TIME]: null,
    [EmployeeRewardPunishmentFields.TYPE]: null,
    [EmployeeRewardPunishmentFields.INFO]: '',
    [EmployeeRewardPunishmentFields.OPERATOR]: '',
    modifystatus: ''
  };
  
  export const getRewardPunishmentColumns = (t) => [
    { title: t('message.rewardPunishment'), dataIndex: EmployeeRewardPunishmentFields.TYPE, key: EmployeeRewardPunishmentFields.TYPE },
    { title: t('message.timeline'), dataIndex: EmployeeRewardPunishmentFields.TIME, key: EmployeeRewardPunishmentFields.TIME, customRender: ({ text }) => formatDate(text, DATE_FORMATS.TABLE_DATE) },
    { title: t('message.description'), dataIndex: EmployeeRewardPunishmentFields.INFO, key: EmployeeRewardPunishmentFields.INFO },
    { title: t('message.operator'), dataIndex: EmployeeRewardPunishmentFields.OPERATOR, key: EmployeeRewardPunishmentFields.OPERATOR, hidden: true },
    { title: t('message.operator'), dataIndex: EmployeeRewardPunishmentFields.OPERATORNAME, key: EmployeeRewardPunishmentFields.OPERATORNAME }
  ];
  
  export const getFormRules = (t) => ({
  });