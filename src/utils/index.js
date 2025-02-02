import { notification } from 'ant-design-vue';

export const utcToChinaTime = (utcDate) => {
    if (!utcDate) return '';
    const utc = new Date(utcDate);
    const chinaTime = new Date(utc.getTime() + 8 * 60 * 60 * 1000);
    return chinaTime;
};

export const showNotification = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
    });
};

export const formatDate = (dateString) => {
    if (!dateString) {
        return '';
    }
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        showNotification('error', t('message.operationTitle'), error);
        return '';
    }
};
