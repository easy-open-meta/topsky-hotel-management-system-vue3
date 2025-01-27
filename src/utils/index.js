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
