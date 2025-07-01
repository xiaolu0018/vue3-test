import { post } from '@/utils/request';

const preUrl = '/server';

// 玩家列表
export const getList = (data: object) => {
  return post(`${preUrl}/info`, data || {})
};