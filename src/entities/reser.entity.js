import { BaseFields, BaseInitialValues } from './common.entity';

export const ReserSpecificFields = {
    ID: 'Id',
    NUMBER: 'ReservationId',
    CUSTOMERNAME: 'CustomerName',
    PHONENUMBER: 'ReservationPhoneNumber',
    CHANNEL: 'ReservationChannel',
    ROOMNUMBER:'ReservationRoomNumber',
    STARTDATE: 'ReservationStartDate',
    ENDDATE: 'ReservationEndDate',
  };
  
  export const ReserFields = {
    ...ReserSpecificFields,
    ...BaseFields
  };
  
  export const initialFormValues = {
    ...BaseInitialValues,
    [ReserFields.NUMBER]: null,
    [ReserFields.CUSTOMERNAME]: '',
    [ReserFields.PHONENUMBER]: '',
    [ReserFields.CHANNEL]: '',
    [ReserFields.ROOMNUMBER]: '',
    [ReserFields.STARTDATE]: null,
    [ReserFields.ENDDATE]: null,
    modifystatus: ''
  };
  
  export const getColumns = (t) => [
    {
      title: t('message.reserNo'),
      dataIndex: ReserFields.NUMBER,
      key: ReserFields.NUMBER,
      sorter: (a, b) => a[ReserFields.NUMBER].localeCompare(b[ReserFields.NUMBER]),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('message.reserCustomerName'),
      dataIndex: ReserFields.CUSTOMERNAME,
      key: ReserFields.CUSTOMERNAME
    },
    {
      title: t('message.reserPhoneNumber'),
      dataIndex: ReserFields.PHONENUMBER,
      key: ReserFields.PHONENUMBER
    },
    {
      title: t('message.reserChannel'),
      dataIndex: ReserFields.CHANNEL,
      key: ReserFields.CHANNEL
    },
    {
      title: t('message.reserRoomNumber'),
      dataIndex: ReserFields.ROOMNUMBER,
      key: ReserFields.ROOMNUMBER
    },
    {
      title: t('message.reserStartDate'),
      dataIndex: ReserFields.STARTDATE,
      key: ReserFields.STARTDATE
    },
    {
      title: t('message.reserEndDate'),
      dataIndex: ReserFields.ENDDATE,
      key: ReserFields.ENDDATE
    },
    {
      title: t('message.operation'),
      key: 'operation'
    }
  ];
  
  export const getFormRules = (t) => ({
    [ReserFields.NUMBER]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserNo')
        }),
        trigger:'blur'
      }
    ],
    [ReserFields.CUSTOMERNAME]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserCustomerName')
        }),
        trigger:'blur'
      }
    ],
    [ReserFields.PHONENUMBER]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserPhoneNumber')
        }),
        trigger:'blur'
      }
    ],
    [ReserFields.CHANNEL]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserChannel')
        }),
        trigger:'blur'
      }
    ],
    [ReserFields.ROOMNUMBER]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserRoomNumber')
        }),
        trigger:'blur'
      }
    ],
    [ReserFields.STARTDATE]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserStartDate')
        }),
        trigger:'blur'
      }
    ],
    [ReserFields.ENDDATE]: [
      {
        required: true,
        message: t('message.required', {
          field: t('message.reserEndDate')
        }),
        trigger:'blur'
      }
    ]
  });