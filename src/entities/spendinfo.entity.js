import { BaseFields, BaseInitialValues } from './common.entity';
import { formatDate } from '@/utils/index';

export const SpendInfoSpecificFields = {
  ROOM_NO: 'RoomNumber',
  CUSTO_NO: 'CustomerNumber',
  NAME: 'ProductName',
  AMOUNT: 'ConsumptionQuantity',
  PRICE: 'ProductPrice',
  PRICEFORMATTED: 'ProductPriceFormatted',
  MONEY: 'ConsumptionAmount',
  MONEYFORMATTED: 'ConsumptionAmountFormatted',
  TIME: 'ConsumptionTime',
  STATE: 'SettlementStatus',
  STATE_NAME: 'SettlementStatusDescription'
};

export const SpendInfoFields = {
  ...SpendInfoSpecificFields,
  ...BaseFields
};

export const SpendState = {
  UNPAID: 'UnSettle',
  PAID: 'Settled'
};

export const StateColors = {
  [SpendState.UNPAID]: '#f50',
  [SpendState.PAID]: '#87d068',
};

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const initialFormValues = {
  ...BaseInitialValues,
  [SpendInfoFields.ROOM_NO]: null,
  [SpendInfoFields.CUSTO_NO]: null,
  [SpendInfoFields.NAME]: '',
  [SpendInfoFields.AMOUNT]: 1,
  [SpendInfoFields.PRICE]: 0,
  [SpendInfoFields.MONEY]: 0,
  [SpendInfoFields.TIME]: null,
  [SpendInfoFields.STATE]: SpendState.UNPAID
};

export const getColumns = (t) => [
  {
    title: t('message.roomNo'),
    dataIndex: SpendInfoFields.ROOM_NO,
    key: SpendInfoFields.ROOM_NO,
    sorter: (a, b) => a[SpendInfoFields.ROOM_NO].localeCompare(b[SpendInfoFields.ROOM_NO])
  },
  {
    title: t('message.customerNo'),
    dataIndex: SpendInfoFields.CUSTO_NO,
    key: SpendInfoFields.CUSTO_NO,
    sorter: (a, b) => a[SpendInfoFields.CUSTO_NO].localeCompare(b[SpendInfoFields.CUSTO_NO])
  },
  {
    title: t('message.spendName'),
    dataIndex: SpendInfoFields.NAME,
    key: SpendInfoFields.NAME,
    ellipsis: true
  },
  {
    title: t('message.spendAmount'),
    dataIndex: SpendInfoFields.AMOUNT,
    key: SpendInfoFields.AMOUNT
  },
  {
    title: t('message.spendPrice'),
    dataIndex: SpendInfoFields.PRICE,
    key: SpendInfoFields.PRICE,
    hidden: true
  },
  {
    title: t('message.spendMoney'),
    dataIndex: SpendInfoFields.MONEY,
    key: SpendInfoFields.MONEY,
    hidden: true
  },
  {
    title: t('message.spendPrice'),
    dataIndex: SpendInfoFields.PRICEFORMATTED,
    key: SpendInfoFields.PRICEFORMATTED
  },
  {
    title: t('message.spendMoney'),
    dataIndex: SpendInfoFields.MONEYFORMATTED,
    key: SpendInfoFields.MONEYFORMATTED
  },
  {
    title: t('message.spendTime'),
    dataIndex: SpendInfoFields.TIME,
    key: SpendInfoFields.TIME,
    customRender: ({ text }) => formatDate(text, SpendInfoFields.TIME),
    width: 180
  },
  {
    title: t('message.moneyState'),
    dataIndex: SpendInfoFields.STATE_NAME,
    key: SpendInfoFields.STATE,
    width: 100
  },
  {
    title: t('message.operation'),
    key: 'operation',
    width: 120
  }
];

export const getFormRules = (t) => ({
  [SpendInfoFields.NAME]: [
    { 
      required: true,
      message: t('message.pleaseInputSpendName', { field: t('message.spendName') }),
      trigger: 'blur',
      whitespace: true
    }
  ],
  [SpendInfoFields.AMOUNT]: [
    { 
      required: true,
      type: 'number',
      min: 1,
      message: t('message.pleaseInputSpendAmount', { field: t('message.spendAmount'), min: 1 }),
      trigger: 'blur'
    }
  ],
  [SpendInfoFields.PRICE]: [
    { 
      required: true,
      type: 'number',
      min: 0,
      message: t('message.pleaseInputSpendPrice', { field: t('message.spendPrice'), min: 0 }),
      trigger: 'blur'
    }
  ],
  [SpendInfoFields.MONEY]: [
    { 
      required: true,
      type: 'number',
      min: 0,
      message: t('message.pleaseInputSpendMoney', { field: t('message.spendMoney'), min: 0 }),
      trigger: 'blur'
    }
  ],
  [SpendInfoFields.TIME]: [
    { 
      required: true,
      message: t('message.pleaseInputSpendTime', { field: t('message.spendTime') }),
      trigger: 'change'
    }
  ]
});