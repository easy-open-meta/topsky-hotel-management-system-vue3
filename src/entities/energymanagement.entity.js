import { BaseFields, BaseInitialValues } from './common.entity';

export const EnergyManagementSpecificFields  = {
    ID: 'Id',
    NUMBER: 'InformationId',
    ROOMNUMBER: 'RoomNumber',
    CUSTOMERNUMBER: 'CustomerNumber',
    STARTDATE: 'StartDate',
    ENDDATE: 'EndDate',
    POWERUSAGE: 'PowerUsage',
    WATERUSAGE: 'WaterUsage',
    RECORDER: 'Recorder'
  };

  export const EnergyManagementFields = {
    ...EnergyManagementSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [EnergyManagementFields.NUMBER]: '',
    [EnergyManagementFields.ROOMNUMBER]: '',
    [EnergyManagementFields.CUSTOMERNUMBER]: '',
    [EnergyManagementFields.STARTDATE]: null,
    [EnergyManagementFields.ENDDATE]: null,
    [EnergyManagementFields.POWERUSAGE]: null,
    [EnergyManagementFields.WATERUSAGE]: null,
    [EnergyManagementFields.RECORDER]: '',
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
        title: t('message.wtiNo'),
        dataIndex: [EnergyManagementFields.NUMBER],
        key: [EnergyManagementFields.NUMBER],
      },
      {
        title: t('message.roomNo'),
        dataIndex: [EnergyManagementFields.ROOMNUMBER],
        key: [EnergyManagementFields.ROOMNUMBER]
      },
      {
        title: t('message.custoNo'),
        dataIndex: [EnergyManagementFields.CUSTOMERNUMBER],
        key: [EnergyManagementFields.CUSTOMERNUMBER],
      },
      {
        title: t('message.useDate'),
        dataIndex: [EnergyManagementFields.STARTDATE],
        key: [EnergyManagementFields.STARTDATE],
      },
      {
        title: t('message.endDate'),
        dataIndex: [EnergyManagementFields.ENDDATE],
        key: [EnergyManagementFields.ENDDATE],
      },
      {
        title: t('message.waterUse'),
        dataIndex: [EnergyManagementFields.WATERUSAGE],
        key: [EnergyManagementFields.WATERUSAGE],
      },
      {
        title: t('message.powerUse'),
        dataIndex: [EnergyManagementFields.POWERUSAGE],
        key: [EnergyManagementFields.POWERUSAGE],
      },
      {
        title: t('message.recorder'),
        dataIndex: [EnergyManagementFields.RECORDER],
        key: [EnergyManagementFields.RECORDER],
      },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [EnergyManagementFields.WATERUSAGE]: [{ required: true, message: t('message.pleaseInputWaterUse'), trigger: 'blur' }],
    [EnergyManagementFields.POWERUSAGE]: [{ required: true, message: t('message.pleaseInputPowerUse'), trigger: 'blur' }],
  });