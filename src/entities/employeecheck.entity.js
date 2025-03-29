import { BaseFields, BaseInitialValues } from './common.entity';
import { formatDate } from '@/utils/index';

export const EmployeeCheckSpecificFields  = {
    NUMBER: 'Id',
    EMPLOYEENUMBER: 'EmployeeId',
    CHECKTIME: 'CheckTime',
    CHECKSTATUS: 'CheckStatus',
    CHECKMETHOD: 'CheckMethod'
  };

  export const DATE_FORMATS = {
    SHORT_DATE: 'YYYY-MM-DD',
    LONG_DATE: 'MMMM Do YYYY',
    TABLE_DATE: 'MM/DD/YYYY'
  };

  export const EmployeeCheckFields = {
    ...EmployeeCheckSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [EmployeeCheckFields.NUMBER]: null,
    [EmployeeCheckFields.EMPLOYEENUMBER]: '',
    [EmployeeCheckFields.CHECKTIME]: null,
    [EmployeeCheckFields.CHECKSTATUS]: '',
    [EmployeeCheckFields.CHECKMETHOD]: '',
    modifystatus: ''
  };
  
  export const getCheckColumns = (t) => [
      { title: t('message.checkTime'), dataIndex: EmployeeCheckFields.CHECKTIME,key: EmployeeCheckFields.CHECKTIME, customRender: ({ text }) => formatDate(text, DATE_FORMATS.TABLE_DATE) },
      { title: t('message.checkStatus'), dataIndex: EmployeeCheckFields.CHECKSTATUS,key: EmployeeCheckFields.CHECKSTATUS },
      { title: t('message.checkMethod'), dataIndex: EmployeeCheckFields.CHECKMETHOD,key: EmployeeCheckFields.CHECKMETHOD },
      
  ];
  
  export const getFormRules = (t) => ({
  
  });