import { generateKeyWithConfig } from '@/utils/index';
import { formatTime, relativeTime } from '@/utils/dayFormate';
import { DateTime_Formate_For_Dayjs } from '@/utils/contant'
import { exportToCsv, exportToTxt } from '@/utils/export';
// 设备使用信息
export interface DeviceUsage {
  used: number;
  limit: number;
}

// 时间信息
export interface TimeInfo {
  text: string;
  className: 'time-expired' | 'time-warning' | 'time-normal';
}

// 密钥实体类型
export interface SchoolKey {
  id?: number;
  license?: string;
  type?: 'school'; // 目前只有学校类型
  status?: number;
  school_name: string;
  device_limit: number;
  used_device?: number;
  keyExpiry?: Date;
  created_at?: string;
  remarks?: string;
  start_time?: string;
  end_time?: string;
  activation_start_time?: string;
  activation_end_time?: string;
  start_ip?: string;
  end_ip?: string;
  quantity?: number;
  period?: number;
  statusTagType?: string;
  statusText?: string;
}

// 密钥数据集合
export interface KeyData {
  total: number;
  unused: number;
  used: number;
  expired: number;
  banned: number;
  keys: SchoolKey[];
}

// 筛选器类型
export interface KeyFilter {
  status?: number;
  license?: string;
  school_name?: string;
  create_at?: string;
}


export function generateMockData() {
  const data = [];
  const statuses = [0, 1, 2, 3];
  const schools = ['北京大学', '清华大学', '上海交通大学', '复旦大学', '浙江大学', '中南大学', '华中科技大学', '西安交通大学'];

  for (let i = 1; i <= 16; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const keyExpiry = new Date(createdDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    const school_name = schools[Math.floor(Math.random() * schools.length)];
    const device_limit = [20, 50, 100, 200][Math.floor(Math.random() * 4)];
    const used_device = status === 0 ? Math.floor(Math.random() * device_limit) : 0;


    const startMark = Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000
    const endMark = startMark + Math.random() * 90 * 24 * 60 * 60 * 1000
    const activation_start_time = startMark + Math.random() * 90 * 24 * 60 * 60 * 1000
    const activation_end_time = activation_start_time + Math.random() * 90 * 24 * 60 * 60 * 1000
    data.push({
      id: i,
      license: generateKeyWithConfig(),
      type: 'school',
      status: Math.floor(Math.random() * statuses.length),
      school_name: school_name,
      device_limit: device_limit,
      used_device: used_device,
      remaining: relativeTime(Date.now(), endMark),
      created_at: formatTime(createdDate, DateTime_Formate_For_Dayjs),
      remarks: i % 5 === 0 ? `${school_name}批量激活密钥` : '',
      start_time: formatTime(startMark, DateTime_Formate_For_Dayjs),
      end_time: formatTime(endMark, DateTime_Formate_For_Dayjs),
      activation_start_time: formatTime(activation_start_time, DateTime_Formate_For_Dayjs),
      activation_end_time: formatTime(endMark, DateTime_Formate_For_Dayjs),
      start_ip: '',
      end_ip: '',
    });
  }
  return data;
}

// 表格
export const exportCsvKeys = (data: SchoolKey[], filename: string) => {
  let csvContent: any[][] = [
    ["密钥", "学校标记", "状态", "设备限制", "密钥有效期", "创建时间", "备注"]
  ];
  data.forEach(k => {
    csvContent.push([
      k.license,
      k.school_name,
      "未使用",
      k.device_limit,
      k.end_time || k.activation_end_time,
      k.created_at || '',
      k.remarks || ''
    ]);
  });
  return exportToCsv(csvContent, filename)
};

// 导出为TXT
export const exportTxtKeys = (data: SchoolKey[], filename: string) => {
  const content = data.map(k =>
    `${k.license} | ${k.school_name} | 有效期至: ${k.end_time || k.activation_end_time}`
  ).join('\n');


  return exportToTxt(content, filename)
};

// 导出列表
export const exportCsvKeyList = (data: any[], filename: string) => {
  let csvContent: any[][] = [
    ["密钥", "学校标记", "状态", "设备使用", "有效期", "创建时间", "备注"]
  ];
  data.forEach(k => {
    csvContent.push([
      k.license,
      k.school_name,
      k.statusText || '未知',
      `${k.device_count || 0}/${k.device_limit || 0}`,
      k.end_time || k.activation_end_time,
      k.created_at || '',
      k.remarks || ''
    ]);
  });
  return exportToCsv(csvContent, filename)
};