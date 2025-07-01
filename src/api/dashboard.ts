import { post } from '@/utils/request';

const preUrl = '/dashboard';

// 玩家列表
export const getData = (data: object) => {
  return post(`${preUrl}/query`, data || {})
};