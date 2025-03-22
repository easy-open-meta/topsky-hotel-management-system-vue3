import { BaseFields, BaseInitialValues } from './common.entity';

export const RoomConfigSpecificFields = {
  NO: 'RoomTypeId',
  NAME: 'RoomTypeName',
  RENT: 'RoomRent',
  DEPOSIT: 'RoomDeposit'
};

export const RoomConfigFields = {
  ...RoomConfigSpecificFields,
  ...BaseFields
};

export const initialFormValues = {
  ...BaseInitialValues,
  [RoomConfigFields.NO]: null,
  [RoomConfigFields.NAME]: '',
  [RoomConfigFields.RENT]: 0,
  [RoomConfigFields.DEPOSIT]: 0
};

export const getColumns = (t) => [
  {
    title: t('message.roomTypeCode'),
    dataIndex: RoomConfigFields.NO,
    key: RoomConfigFields.NO,
    sorter: (a, b) => a[RoomConfigFields.NO] - b[RoomConfigFields.NO]
  },
  {
    title: t('message.roomTypeName'),
    dataIndex: RoomConfigFields.NAME,
    key: RoomConfigFields.NAME,
    sorter: (a, b) => a[RoomConfigFields.NAME].localeCompare(b[RoomConfigFields.NAME])
  },
  {
    title: t('message.roomRent'),
    dataIndex: RoomConfigFields.RENT,
    key: RoomConfigFields.RENT
  },
  {
    title: t('message.roomDeposit'),
    dataIndex: RoomConfigFields.DEPOSIT,
    key: RoomConfigFields.DEPOSIT
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t) => ({
  [RoomConfigFields.NO]: [
    { required: true, message: t('message.pleaseInputRoomTypeCode'), trigger: 'blur' },
    { type: 'number', min: 1, message: t('message.codeMinimumError') }
  ],
  [RoomConfigFields.NAME]: [
    { 
      required: true,
      message: t('message.pleaseInputRoomTypeName'),
      trigger: 'blur',
      whitespace: true
    }
  ],
  [RoomConfigFields.RENT]: [
    { 
      required: true,
      message: t('message.pleaseInputRoomRent'),
      trigger: 'blur',
      type: 'number',
      min: 0
    }
  ],
  [RoomConfigFields.DEPOSIT]: [
    { 
      required: true,
      message: t('message.pleaseInputRoomDeposit'),
      trigger: 'blur',
      type: 'number',
      min: 0
    }
  ]
});