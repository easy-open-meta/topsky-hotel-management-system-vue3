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

/**
 * 货币格式化函数
 * @param {number|string} value - 需要格式化的数值
 * @returns {string} 格式化后的货币字符串
 */
export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return ''
    
    const numericValue = Number(value)
    
    if (isNaN(numericValue)) return ''
  
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue)
  }
