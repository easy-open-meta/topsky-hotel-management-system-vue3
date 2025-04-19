import { BaseFields, BaseInitialValues } from './common.entity';

export const GoodsSpecificFields = {
    NUMBER: 'ProductNumber',
    NAME: 'ProductName',
    PRICE: 'ProductPrice',
    SPECIFICATION: 'Specification',
    STOCK: 'Stock'
};

export const GoodsFields = {
    ...GoodsSpecificFields,
    ...BaseFields
};

export const initialFormValues = {
    ...BaseInitialValues,
    [GoodsFields.NUMBER]: null,
    [GoodsFields.NAME]: '',
    [GoodsFields.PRICE]: null,
    [GoodsFields.SPECIFICATION]: '',
    [GoodsFields.STOCK]: null,
    modifystatus: ''
};

export const getColumns = (t) => [
    {
        title: t('message.goodsNumber'),
        dataIndex: GoodsFields.NUMBER,
        key: GoodsFields.NUMBER,
        sorter: (a, b) => a[GoodsFields.NUMBER].localeCompare(b[GoodsFields.NUMBER]),
        defaultSortOrder: 'ascend'
    },
    {
        title: t('message.goodsName'),
        dataIndex: GoodsFields.NAME,
        key: GoodsFields.NAME
    },
    {
        title: t('message.goodsPrice'),
        dataIndex: GoodsFields.PRICE,
        key: GoodsFields.PRICE,
        customRender: ({ text }) => `￥${Number(text).toFixed(2)}`
    },
    {
        title: t('message.goodsSpecification'),
        dataIndex: GoodsFields.SPECIFICATION,
        key: GoodsFields.SPECIFICATION
    },
    {
        title: t('message.goodsStock'),
        dataIndex: GoodsFields.STOCK,
        key: GoodsFields.STOCK
    },
    {
        title: t('message.operation'),
        key: 'operation'
    }
];

export const getFormRules = (t) => ({
    [GoodsFields.NAME]: [
        { required: true, message: t('message.pleaseInputGoodsName'), trigger: 'blur' }
    ],
    [GoodsFields.PRICE]: [
        { required: true, message: t('message.pleaseInputGoodsPrice'), trigger: 'blur' },
        { type: 'number', min: 0, message: t('message.priceMinimumWarning') }
    ],
    [GoodsFields.STOCK]: [
        { required: true, message: t('message.pleaseInputGoodsStock'), trigger: 'blur' },
        { type: 'number', min: 0, message: t('message.stockMinimumWarning') }
    ]
});