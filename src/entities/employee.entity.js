import { BaseFields, BaseInitialValues } from './common.entity';

export const EmployeeSpecificFields  = {
    ID: 'Id',
    NUMBER: 'EmployeeId',
    NAME: 'EmployeeName',
    GENDER: 'Gender',
    GENDERNAME: 'GenderName',
    DATEOFBIRTH: 'DateOfBirth',
    ETHNICITY: 'Ethnicity',
    ETHNICITYNAME: 'EthnicityName',
    PHONENUMBER: 'PhoneNumber',
    DEPARTMENT: 'Department',
    DEPARTMENTNAME: 'DepartmentName',
    ADDRESS: 'Address',
    POSITION: 'Position',
    POSITIONNAME: 'PositionName',
    IDCARDNUMBER: 'IdCardNumber',
    HIREDATE: 'HireDate',
    POLITICALAFFILIATION: 'PoliticalAffiliation',
    POLITICALAFFILIATIONNAME: 'PoliticalAffiliationName',
    EDUCATIONLEVEL: 'EducationLevel',
    EDUCATIONLEVELNAME: 'EducationLevelName',
  };

  export const EmployeeFields = {
    ...EmployeeSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [EmployeeFields.NUMBER]: null,
    [EmployeeFields.NAME]: '',
    [EmployeeFields.GENDER]: '',
    [EmployeeFields.GENDERNAME]: '',
    [EmployeeFields.DATEOFBIRTH]: null,
    [EmployeeFields.ETHNICITY]: '',
    [EmployeeFields.ETHNICITYNAME]: '',
    [EmployeeFields.PHONENUMBER]: '',
    [EmployeeFields.DEPARTMENT]: '',
    [EmployeeFields.DEPARTMENTNAME]: '',
    [EmployeeFields.ADDRESS]: '',
    [EmployeeFields.POSITION]: '',
    [EmployeeFields.POSITIONNAME]: '',
    [EmployeeFields.IDCARDNUMBER]: '',
    [EmployeeFields.HIREDATE]: null,
    [EmployeeFields.POLITICALAFFILIATION]: '',
    [EmployeeFields.POLITICALAFFILIATIONNAME]: '',
    [EmployeeFields.EDUCATIONLEVEL]: '',
    [EmployeeFields.EDUCATIONLEVELNAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
        title: t('message.staffId'),
        dataIndex: EmployeeFields.NUMBER,
        key: EmployeeFields.NUMBER,
        sorter: (a, b) => a[EmployeeFields.NUMBER].localeCompare(b[EmployeeFields.NUMBER]),
        defaultSortOrder: 'ascend'
      },
      {
        title: t('message.staffName'),
        dataIndex: EmployeeFields.NAME,
        key: EmployeeFields.NAME,
      },
      {
        title: t('message.staffSex'),
        dataIndex: EmployeeFields.GENDER,
        key: EmployeeFields.GENDER,
        hidden: true,
      },
      {
        title: t('message.staffSex'),
        dataIndex: EmployeeFields.GENDERNAME,
        key: EmployeeFields.GENDERNAME,
      },
      {
        title: t('message.staffBirthday'),
        dataIndex: EmployeeFields.DATEOFBIRTH,
        key: EmployeeFields.DATEOFBIRTH,
      },
      {
        title: t('message.staffEducation'),
        dataIndex: EmployeeFields.EDUCATIONLEVEL,
        key: EmployeeFields.EDUCATIONLEVEL,
        hidden: true,
      },
      {
        title: t('message.staffEducation'),
        dataIndex: EmployeeFields.EDUCATIONLEVELNAME,
        key: EmployeeFields.EDUCATIONLEVELNAME,
      },
      {
        title: t('message.staffNation'),
        dataIndex: EmployeeFields.ETHNICITY,
        key: EmployeeFields.ETHNICITY,
        hidden: true
      },
      {
        title: t('message.staffNation'),
        dataIndex: EmployeeFields.ETHNICITYNAME,
        key: EmployeeFields.ETHNICITYNAME
      },
      {
        title: t('message.staffDepartment'),
        dataIndex: EmployeeFields.DEPARTMENT,
        key: EmployeeFields.DEPARTMENT,
        hidden: true
      },
      {
        title: t('message.staffDepartment'),
        dataIndex: EmployeeFields.DEPARTMENTNAME,
        key: EmployeeFields.DEPARTMENTNAME
      },
      {
        title: t('message.staffPosition'),
        dataIndex: EmployeeFields.POSITION,
        key: EmployeeFields.POSITION,
        hidden: true
      },
      {
        title: t('message.staffPosition'),
        dataIndex: EmployeeFields.POSITIONNAME,
        key: EmployeeFields.POSITIONNAME
      },
      {
        title: t('message.staffCardID'),
        dataIndex: EmployeeFields.IDCARDNUMBER,
        key: EmployeeFields.IDCARDNUMBER
      },
      {
        title: t('message.staffTel'),
        dataIndex: EmployeeFields.PHONENUMBER,
        key: EmployeeFields.PHONENUMBER
      },
      {
        title: t('message.staffAddress'),
        dataIndex: EmployeeFields.ADDRESS,
        key: EmployeeFields.ADDRESS
      },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [EmployeeFields.NAME]: [
      { required: true, message: t('message.pleaseInputStaffName'), trigger: 'blur' }
    ],
    [EmployeeFields.GENDER]: [{ required: true, message: t('message.pleaseInputStaffSex'), trigger: 'blur' }],
    [EmployeeFields.PHONENUMBER]: [{ required: true, message: t('message.pleaseInputStaffTel'), trigger: 'blur' }],
    [EmployeeFields.EDUCATIONLEVEL]: [{ required: true, message: t('message.pleaseInputStaffEducation'), trigger: 'blur' }],
    [EmployeeFields.POLITICALAFFILIATION]: [{ required: true, message: t('message.pleaseInputStaffFace'), trigger: 'blur' }],
    [EmployeeFields.ETHNICITY]: [{ required: true, message: t('message.pleaseInputStaffNation'), trigger: 'blur' }],
    [EmployeeFields.DEPARTMENT]: [{ required: true, message: t('message.pleaseInputStaffDepartment'), trigger: 'blur' }],
    [EmployeeFields.POSITION]: [{ required: true, message: t('message.pleaseInputStaffPosition'), trigger: 'blur' }],
    [EmployeeFields.IDCARDNUMBER]: [{ required: true, message: t('message.pleaseInputStaffCardID'), trigger: 'blur' }],
    [EmployeeFields.ADDRESS]: [{ required: true, message: t('message.pleaseInputStaffAddress'), trigger: 'blur' }],
    [EmployeeFields.DATEOFBIRTH]: [{ required: true, message: t('message.pleaseInputStaffBirthday'), trigger: 'blur' }],
    [EmployeeFields.HIREDATE]: [{ required: true, message: t('message.pleaseInputStaffTime'), trigger: 'blur' }],
  });