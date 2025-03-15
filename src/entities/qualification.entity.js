import { BaseFields, BaseInitialValues } from './common.entity';

export const EducationSpecificFields = {
    ID: 'Id',
    NUMBER: 'EducationNumber',
    NAME: 'EducationName'
  };
  
  export const EducationFields = {
    ...EducationSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [EducationFields.NUMBER]: null,
    [EducationFields.NAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.qualificationNo'),
      dataIndex: EducationFields.NUMBER,
      key: EducationFields.NUMBER,
      sorter: (a, b) => a[EducationFields.NUMBER].localeCompare(b[EducationFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.qualificationName'),
      dataIndex: EducationFields.NAME,
      key: EducationFields.NAME
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [EducationFields.NAME]: [
      { required: true, message: t('message.pleaseInputEducationName'), trigger: 'blur' }
    ]
  });