import dayjs from 'dayjs';
import rTime from 'dayjs/plugin/relativeTime';

// 全局使用中文
dayjs.locale('zh-cn');

// 对时间进行格式化
export function formatTime(data: any = new Date(), type = 'YYYY-MM-DD') {
  return dayjs(data).format(type);
}

export type RangeType = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year'
// 根据range指定时间获取时间格式化，
// today 今天，yesterday 昨天，week 本周，month 本月，quarter 最近三个月，year 本年
export function getTimeFormatForRange(
  range: RangeType = 'today',
  type = 'YYYY-MM-DD HH:mm:ss'
): [string, string] {
  switch (range) {
    case 'today':
      return [
        dayjs().startOf('day').format(type),
        dayjs().endOf('day').format(type)
      ];
    case 'yesterday':
      return [
        dayjs().subtract(1, 'day').startOf('day').format(type),
        dayjs().subtract(1, 'day').endOf('day').format(type)
      ];
    case 'week':
      return [
        dayjs().startOf('week').format(type),
        dayjs().endOf('week').format(type)
      ];
    case 'month':
      return [
        dayjs().startOf('month').format(type),
        dayjs().endOf('month').format(type)
      ];
    case 'quarter':
      return [
        dayjs().subtract(2, 'month').startOf('month').format(type),
        dayjs().endOf('month').format(type)
      ];
    case 'year':
      return [
        dayjs().startOf('year').format(type),
        dayjs().endOf('year').format(type)
      ];
    default:
      return [
        dayjs().format(type),
        dayjs().format(type)
      ];
  }
}
// 获取指定日期的开始时间戳
export function getStartDayTime(day: any) {
  return dayjs(day).startOf('D').valueOf();
}
// 获取指定日期的结束时间戳
export function getEndDayTime(day: any) {
  return dayjs(day).endOf('D').valueOf();
}
// 获取当天的开始和结束时间戳
export function getDayRange() {
  return [dayjs().startOf('D').valueOf(), dayjs().endOf('D').valueOf()];
}
// 其它例如相对时间，需要单独配置它自己的插件才可以使用
dayjs.extend(rTime);

// 获取相对时间字符串，表示从 btime 到 value 的相对时间
export const relativeTime = (btime: any, value: any) => {
  return dayjs(btime).to(dayjs(value));
};

// 获取指定时间和当前时间差值
// 如果etime为空，则返回'--'
// 如果时间戳比较etime<=btime，则返回'0天'
// 否则返回从btime到etime的时间差，单位为天
export const getTimeDiffNow = (etime: any) => {
  if (!etime) return '--';
  const btime = Date.now();
  const diffMs = dayjs(etime).valueOf() - btime;

  // 如果时间已过去，直接返回 0 天
  if (diffMs <= 0) return '0天';

  // 自定义格式化，例如显示 "X天X小时X分钟"
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}天${hours}小时`;
  if (hours > 0) return `${hours}小时${minutes}分钟`;
  return `${minutes}分钟`;
}
// 计算从 btime 到 value 的时间差，单位为毫秒
export const diffTime = (btime: any, value: any) => {
  return dayjs(btime).diff(dayjs(value));
};

// 导出时间格式化相关的方法
export default {
  formatTime,
  relativeTime,
  getDayRange,
  getStartDayTime,
  getEndDayTime,
  diffTime,
  getTimeDiffNow,
};