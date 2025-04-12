import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { dateFieldConfig } from '@/config/dateFields';
import i18n from '@/i18n';

export const utcToChinaTime = (utcDate) => {
    if (!utcDate) return '';
    const utc = new Date(utcDate);
    const chinaTime = new Date(utc.getTime() + 8 * 60 * 60 * 1000);
    return chinaTime;
};

export const showWarningNotification = (description) => {
  notification['warning']({
      message: i18n.global.t('message.operationTitle'),
      description: description,
      duration: 3
  });
};

export const showErrorNotification = (description) => {
  notification['error']({
      message: i18n.global.t('message.operationTitle'),
      description: description,
      duration: 3
  });
};

export const showInfoNotification = (description) => {
  notification['info']({
      message: i18n.global.t('message.operationTitle'),
      description: description,
      duration: 3
  });
};

export const showSuccessNotification = (description) => {
  notification['success']({
      message: i18n.global.t('message.operationTitle'),
      description: description,
      duration: 3
  });
};

export const formatDate = (dateString, fieldName = null) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date)) throw new Error('Invalid Date');
      
      let format = 'YYYY-MM-DD';
      if (fieldName && dateFieldConfig.WITH_TIME.includes(fieldName)) {
        format = 'YYYY-MM-DD HH:mm:ss';
      }
      
      return dayjs(date).format(format);
      
    } catch (error) {
      console.error('日期格式化失败:', error);
      return '';
    }
  };

export const formatDateTime = (dateString) => {
    if (!dateString) {
        return '';
    }
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      showErrorNotification(error);
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
