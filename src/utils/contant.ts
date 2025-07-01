export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || '游戏管理系统';


export const PHONE_REGEXP = /^1[2-9]\d{9}$/; // 手机号正则
export const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 邮箱正则
export const IPv4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?!$)|$)){4}$/; // 支持0.0.0.0的ip正则
export const ACCOUNT_PSD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[\]\{\}\|\\\\;:'",\.<>\/\?\-])[A-Za-z\d!@#$%^&*()_+=\[\]\{\}\|\\\\;:'",\.<>\/\?\-]{8,20}$/; // 密码正则,8-20位，包含大小写字母、数字和特殊字符
export const Date_Formate = 'yyyy-MM-dd';
export const Time_Formate = 'HH:mm:ss';
export const DateTime_Formate = Date_Formate + ' ' + Time_Formate;

// dayjs
export const Date_Formate_For_Dayjs = 'YYYY-MM-DD';
export const DateTime_Formate_For_Dayjs = Date_Formate_For_Dayjs + ' ' + Time_Formate;

