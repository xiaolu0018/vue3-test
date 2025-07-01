import { post } from '@/utils/request';

const preUrl = '/notice';

// 玩家列表
export const getList = (data: object) => {
  return post(`${preUrl}/query`, data || {})
};

export const getDetail = (data: object) => {
  return post(`${preUrl}/detail`, data || {})
};

export const add = (data: object) => {
  return post(`${preUrl}/add`, data || {})
};

export const edit = (data: object) => {
  return post(`${preUrl}/edit`, data || {})
};
export const remove = (data: object) => {
  return post(`${preUrl}/delete`, data || {})
}
export const publish = (data: object) => {
  return post(`${preUrl}/publish`, data || {})
}
export const getHistory = (data: object) => {
  return post(`${preUrl}/history`, data || {})
}

// 公告类型分布统计
export const getNoticeType = (data: object) => {
  return post(`${preUrl}/types`, data || {})
}