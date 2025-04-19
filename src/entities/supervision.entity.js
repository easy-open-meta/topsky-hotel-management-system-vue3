import { BaseFields, BaseInitialValues } from './common.entity';

export const SupervisionSpecificFields = {
  CHECK_NO: 'StatisticsNumber',
  CHECK_CLUB: 'SupervisingDepartment',
  CHECK_CLUB_NAME: 'SupervisingDepartmentName',
  CHECK_PROGRES: 'SupervisionProgress',
  CHECK_CASH: 'SupervisionLoss',
  CHECK_SCORE: 'SupervisionScore',
  CHECK_PERSON: 'SupervisionStatistician',
  CHECK_ADVICE: 'SupervisionAdvice',
  DATA_INS_USR: 'DataInsUsr',
  DATA_INS_DATE: 'DataInsDate',
  DATA_CHG_USR: 'DataChgUsr',
  DATA_CHG_DATE: 'DataChgDate',
  IS_DELETE: 'isDelete'
};

export const SupervisionFields = {
  ...SupervisionSpecificFields,
  ...BaseFields
};

export const initialFormValues = {
  ...BaseInitialValues,
  [SupervisionFields.CHECK_NO]: null,
  [SupervisionFields.CHECK_CLUB]: '',
  [SupervisionFields.CHECK_PROGRES]: '',
  [SupervisionFields.CHECK_CASH]: '',
  [SupervisionFields.CHECK_SCORE]: 0,
  [SupervisionFields.CHECK_PERSON]: '',
  [SupervisionFields.CHECK_ADVICE]: '',
};

export const getColumns = (t) => [
  {
    title: t('message.checkNo'),
    dataIndex: SupervisionFields.CHECK_NO,
    key: SupervisionFields.CHECK_NO,
    sorter: (a, b) => a[SupervisionFields.CHECK_NO].localeCompare(b[SupervisionFields.CHECK_NO]),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.checkDepartment'),
    dataIndex: SupervisionFields.CHECK_CLUB,
    key: SupervisionFields.CHECK_CLUB,
    hidden: true
  },
  {
    title: t('message.checkDepartment'),
    dataIndex: SupervisionFields.CHECK_CLUB_NAME,
    key: SupervisionFields.CHECK_CLUB_NAME,
  },
  {
    title: t('message.checkProgres'),
    dataIndex: SupervisionFields.CHECK_PROGRES,
    key: SupervisionFields.CHECK_PROGRES,
  },
  {
    title: t('message.checkCash'),
    dataIndex: SupervisionFields.CHECK_CASH,
    key: SupervisionFields.CHECK_CASH,
  },
  {
    title: t('message.checkScore'),
    dataIndex: SupervisionFields.CHECK_SCORE,
    key: SupervisionFields.CHECK_SCORE,
  },
  {
    title: t('message.checkPerson'),
    dataIndex: SupervisionFields.CHECK_PERSON,
    key: SupervisionFields.CHECK_PERSON,
  },
  {
    title: t('message.checkAdvice'),
    dataIndex: SupervisionFields.CHECK_ADVICE,
    key: SupervisionFields.CHECK_ADVICE,
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t) => ({
  [SupervisionFields.CHECK_CLUB]: [
    { required: true, message: t('message.pleaseInputCheckDepartment'), trigger: 'blur' }
  ],
  [SupervisionFields.CHECK_PROGRES]: [
    { required: true, message: t('message.pleaseInputCheckProgres'), trigger: 'blur' }
  ],
  [SupervisionFields.CHECK_CASH]: [
    { required: true, message: t('message.pleaseInputCheckCash'), trigger: 'blur' }
  ],
  [SupervisionFields.CHECK_SCORE]: [
    { required: true, message: t('message.pleaseInputCheckScore'), trigger: 'blur' }
  ],
  [SupervisionFields.CHECK_PERSON]: [
    { required: true, message: t('message.pleaseInputCheckPerson'), trigger: 'blur' }
  ],
  [SupervisionFields.CHECK_ADVICE]: [
    { required: true, message: t('message.pleaseInputCheckAdvice'), trigger: 'blur' }
  ]
});