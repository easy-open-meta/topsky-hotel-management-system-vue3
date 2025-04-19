import { BaseFields, BaseInitialValues } from './common.entity';

export const InternalFinanceSpecificFields  = {
    ID: 'Id',
    NUMBER: 'AssetNumber',
    NAME: 'AssetName',
    ASSETVALUE: 'AssetValue',
    ASSETVALUEFORMATTED: 'AssetValueFormatted',
    DEPARTMENT: 'DepartmentCode',
    DEPARTMENTNAME: 'DepartmentName',
    ACQUISITIONDATE: 'AcquisitionDate',
    ASSETSOURCE: 'AssetSource',
    ACQUIREDBYEMPLOYEE: 'AcquiredByEmployeeId',
    ACQUIREDBYEMPLOYEENAME: 'AcquiredByEmployeeName'
  };

  export const InternalFinanceFields = {
    ...InternalFinanceSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [InternalFinanceFields.NUMBER]: null,
    [InternalFinanceFields.NAME]: '',
    [InternalFinanceFields.ASSETVALUE]: null,
    [InternalFinanceFields.ASSETVALUEFORMATTED]: '',
    [InternalFinanceFields.DEPARTMENT]: '',
    [InternalFinanceFields.DEPARTMENTNAME]: '',
    [InternalFinanceFields.ACQUISITIONDATE]: null,
    [InternalFinanceFields.ASSETSOURCE]: '',
    [InternalFinanceFields.ACQUIREDBYEMPLOYEE]: '',
    [InternalFinanceFields.ACQUIREDBYEMPLOYEENAME]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.internalfinanceNo'),
      dataIndex: InternalFinanceFields.NUMBER,
      key: InternalFinanceFields.NUMBER,
      sorter: (a, b) => a[InternalFinanceFields.NUMBER].localeCompare(b[InternalFinanceFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.internalfinanceName'),
      dataIndex: InternalFinanceFields.NAME,
      key: InternalFinanceFields.NAME
    },
    {
      title: t('message.internalfinancePrice'),
      dataIndex: InternalFinanceFields.ASSETVALUE,
      key: InternalFinanceFields.ASSETVALUE,
      hidden: true
    },
    {
      title: t('message.internalfinancePrice'),
      dataIndex: InternalFinanceFields.ASSETVALUEFORMATTED,
      key: InternalFinanceFields.ASSETVALUEFORMATTED,
    },
    {
      title: t('message.internalfinanceDepartment'),
      dataIndex: InternalFinanceFields.DEPARTMENT,
      key: InternalFinanceFields.DEPARTMENT,
      hidden: true
    },
    {
      title: t('message.internalfinanceDepartment'),
      dataIndex: InternalFinanceFields.DEPARTMENTNAME,
      key: InternalFinanceFields.DEPARTMENTNAME,
    },
    {
      title: t('message.internalfinanceTime'),
      dataIndex: InternalFinanceFields.ACQUISITIONDATE,
      key: InternalFinanceFields.ACQUISITIONDATE,
    },
    {
      title: t('message.internalfinanceSource'),
      dataIndex: InternalFinanceFields.ASSETSOURCE,
      key: InternalFinanceFields.ASSETSOURCE,
    },
    {
      title: t('message.internalfinancePerson'),
      dataIndex: InternalFinanceFields.ACQUIREDBYEMPLOYEE,
      key: InternalFinanceFields.ACQUIREDBYEMPLOYEE,
      hidden: true
    },
    {
      title: t('message.internalfinancePerson'),
      dataIndex: InternalFinanceFields.ACQUIREDBYEMPLOYEENAME,
      key: InternalFinanceFields.ACQUIREDBYEMPLOYEENAME,
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [InternalFinanceFields.NAME]: [
      { required: true, message: t('message.pleaseInputInternalFinanceName'), trigger: 'blur' }
    ],
    [InternalFinanceFields.ASSETVALUE]: [{ required: true, message: t('message.pleaseInputInternalFinancePrice'), trigger: 'blur' }],
    [InternalFinanceFields.DEPARTMENT]: [{ required: true, message: t('message.pleaseInputInternalFinanceDepartment'), trigger: 'blur' }],
    [InternalFinanceFields.ACQUISITIONDATE]: [{ required: true, message: t('message.pleaseInputInternalFinanceTime'), trigger: 'blur' }],
    [InternalFinanceFields.ASSETSOURCE]: [{ required: true, message: t('message.pleaseInputInternalFinanceSource'), trigger: 'blur' }],
    [InternalFinanceFields.ACQUIREDBYEMPLOYEE]: [{ required: true, message: t('message.pleaseInputInternalFinancePerson'), trigger: 'blur' }],
  });