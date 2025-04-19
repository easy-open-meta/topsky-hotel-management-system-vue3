import { BaseFields, BaseInitialValues } from './common.entity';
import { formatDate } from '@/utils/index';

export const LogSpecificFields = {
    ID: 'OperationId',
    TIME: 'OperationTime',
    CONTENT: 'LogContent',
    ACCOUNT: 'OperationAccount',
    LEVEL: 'LogLevel',
    VERSION: 'SoftwareVersion',
    IPADDRESS: 'LoginIpAddress',
    LEVELNAME: 'LogLevelName'
};

export const LogFields = {
    ...LogSpecificFields,
    ...BaseFields
};

export const initialFormValues = {
    ...BaseInitialValues,
    [LogFields.ID]: null,
    [LogFields.TIME]: null,
    [LogFields.CONTENT]: '',
    [LogFields.ACCOUNT]: '',
    [LogFields.LEVEL]: null,
    [LogFields.VERSION]: '',
    [LogFields.IPADDRESS]: '',
    modifystatus: ''
};

export const getColumns = (t) => [
    {
        title: t('message.operationTime'),
        dataIndex: LogFields.TIME,
        key: LogFields.TIME,
        sorter: (a, b) => new Date(a[LogFields.TIME]).getTime() - new Date(b[LogFields.TIME]).getTime(),
        customRender: ({ text }) => formatDate(text, LogFields.TIME),
        defaultSortOrder: 'descend'
    },
    {
        title: t('message.logContent'),
        dataIndex: LogFields.CONTENT,
        key: LogFields.CONTENT,
        width: 300,
        ellipsis: true
    },
    {
        title: t('message.operator'),
        dataIndex: LogFields.ACCOUNT,
        key: LogFields.ACCOUNT
    },
    {
        title: t('message.logLevel'),
        dataIndex: LogFields.LEVELNAME,
        key: LogFields.LEVELNAME
    },
    {
        title: t('message.softwareVersion'),
        dataIndex: LogFields.VERSION,
        key: LogFields.VERSION
    },
    {
        title: t('message.loginIP'),
        dataIndex: LogFields.IPADDRESS,
        key: LogFields.IPADDRESS
    },
    {
        title: t('message.operation'),
        key: 'operation',
    }
];

export const getFormRules = (t) => ({
    // 日志通常为只读，暂不定义表单规则
});