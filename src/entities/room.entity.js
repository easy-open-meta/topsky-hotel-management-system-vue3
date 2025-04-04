import { BaseFields, BaseInitialValues } from './common.entity';

export const RoomSpecificFields = {
  NO: 'RoomNumber',
  NAME: 'RoomName',
  STATE: 'RoomState',
  POSITION: 'RoomLocation',
  CUSTOMER_NAME: 'CustomerName',
  CHECK_IN_TIME: 'LastCheckInTime',
  CHECK_OUT_TIME: 'LastCheckOutTime',
  RENT: 'RoomRent',
  DEPOSIT: 'RoomDeposit',
  STATE_ID: 'RoomStateId',
  TYPE: 'RoomTypeId',
};

export const RoomFields = {
  ...RoomSpecificFields,
  ...BaseFields
};

export const RoomStateMap = {
  'vacant': '空房',
  'occupied': '已住',
  'maintenance': '维修',
  'dirty': '脏房',
  'reserved': '预约'
};

export const RoomStateColors = {
  '空房': '#48a54b',
  '已住': '#1f8de5',
  '维修': '#f0b607',
  '脏房': '#e63f33',
  '预约': '#ff9800'
};

export const initialFormValues = {
  ...BaseInitialValues,
  [RoomFields.NO]: null,
  [RoomFields.NAME]: '',
  [RoomFields.STATE]: 'vacant',
  [RoomFields.STATE_ID]: 0,
  [RoomFields.TYPE]: null,
  [RoomFields.POSITION]: '',
  [RoomFields.CUSTOMER_NAME]: '',
  [RoomFields.CHECK_IN_TIME]: null,
  [RoomFields.CHECK_OUT_TIME]: null,
  [RoomFields.RENT]: 0,
  [RoomFields.DEPOSIT]: 0,
  modifystatus: ''
};

export const getColumns = (t) => [
  {
    title: t('message.roomNo'),
    dataIndex: RoomFields.NO,
    key: RoomFields.NO,
    sorter: (a, b) => a[RoomFields.NO].localeCompare(b[RoomFields.NO]),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.roomType'),
    dataIndex: RoomFields.TYPE,
    key: RoomFields.TYPE,
    hidden: true
  },
  {
    title: t('message.roomType'),
    dataIndex: RoomFields.NAME,
    key: RoomFields.NAME
  },
  {
    title: t('message.roomState'),
    dataIndex: RoomFields.STATE_ID,
    key: RoomFields.STATE_ID,
    hidden: true
  },
  {
    title: t('message.roomState'),
    dataIndex: RoomFields.STATE,
    key: 'RoomState'
  },
  {
    title: t('message.roomRent'),
    dataIndex: RoomFields.RENT,
    key: RoomFields.RENT
  },
  {
    title: t('message.roomDeposit'),
    dataIndex: RoomFields.DEPOSIT,
    key: RoomFields.DEPOSIT
  },
  {
    title: t('message.roomPosition'),
    dataIndex: RoomFields.POSITION,
    key: RoomFields.POSITION
  },
  {
    title: t('message.operation'),
    key: 'operation'
  }
];

export const getFormRules = (t) => ({
  [RoomFields.NO]: [
    { required: true, message: t('message.pleaseInputRoomNo'), trigger: 'blur' }
  ],
  [RoomFields.TYPE]: [
    { required: true, message: t('message.pleaseInputRoomType'), trigger: 'change' }
  ]
});