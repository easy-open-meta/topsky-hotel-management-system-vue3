import { BaseFields, BaseInitialValues } from './common.entity';
import { formatDate } from '@/utils/index';

export const EmployeeHistorySpecificFields  = {
    NUMBER: 'Id',
    EMPLOYEENUMBER: 'EmployeeId',
    STARTDATE: 'StartDate',
    ENDDATE: 'EndDate',
    POSITION: 'Position',
    COMPANY: 'Company'
  };

  export const DATE_FORMATS = {
    SHORT_DATE: 'YYYY-MM-DD',
    LONG_DATE: 'MMMM Do YYYY',
    TABLE_DATE: 'MM/DD/YYYY'
  };

  export const EmployeeHistoryFields = {
    ...EmployeeHistorySpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [EmployeeHistoryFields.NUMBER]: null,
    [EmployeeHistoryFields.EMPLOYEENUMBER]: '',
    [EmployeeHistoryFields.STARTDATE]: null,
    [EmployeeHistoryFields.ENDDATE]: null,
    [EmployeeHistoryFields.POSITION]: '',
    [EmployeeHistoryFields.COMPANY]: '',
    modifystatus: ''
  };
  
  export const getHistoryColumns = (t) => [
      { title: t('message.hireDate'), dataIndex: EmployeeHistoryFields.STARTDATE,key: EmployeeHistoryFields.STARTDATE,customRender: ({ text }) => formatDate(text, DATE_FORMATS.TABLE_DATE) },
      { title: t('message.departureDate'), dataIndex: EmployeeHistoryFields.ENDDATE,key: EmployeeHistoryFields.ENDDATE,customRender: ({ text }) => formatDate(text, DATE_FORMATS.TABLE_DATE) },
      { title: t('message.historyPosition'), dataIndex: EmployeeHistoryFields.POSITION,key: EmployeeHistoryFields.POSITION },
      { title: t('message.company'), dataIndex: EmployeeHistoryFields.COMPANY,key: EmployeeHistoryFields.COMPANY }
  ];
  
  export const getFormRules = (t) => ({
  });