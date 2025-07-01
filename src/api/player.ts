import { post } from '@/utils/request';
import { exportFile } from '@/utils/fetchFile';

const preUrl = '/user';
const banPreUrl = '/ban';
const whitePreUrl = '/white';

// 玩家列表
export const getList = (data: object) => {
  return post(`${preUrl}/query`, data || {})
};

export const getDetail = (data: object) => {
  return post(`${preUrl}/detail`, data || {})
};
export const getDistribution = (data: object) => {
  return post(`${preUrl}/distribution`, data || {})
}
export const add = (data: object) => {
  return post(`${preUrl}/add`, data || {})
};

export const edit = (data: object) => {
  return post(`${preUrl}/edit`, data || {})
};
export const remove = (data: object) => {
  return post(`${preUrl}/delete`, data || {})
}
export const exportPlayer = (ids: Array<string>) => {
  return exportFile({
    url: `${preUrl}/export`,
    data: { ids }
  });
}
// ban 封禁
export const getBanList = (data: object) => {
  return post(`${preUrl}${banPreUrl}/list`, data || {})
}
export const addBan = (data: object) => {
  return post(`${preUrl}${banPreUrl}/add`, data || {})
}
export const editBan = (data: object) => {
  return post(`${preUrl}${banPreUrl}/edit`, data || {})
}
export const getBanDetail = (data: object) => {
  return post(`${preUrl}${banPreUrl}/detail`, data || {})
}
export const removeBan = (data: object) => {
  return post(`${preUrl}${banPreUrl}/delete`, data || {})
}
export const exportBan = (ids: Array<string>) => {
  return exportFile({
    url: `${preUrl}${banPreUrl}/export`,
    data: { ids }
  });
}
// white 白名单
export const getWhiteList = (data: object) => {
  return post(`${preUrl}${whitePreUrl}/list`, data || {})
}
export const addWhite = (data: object) => {
  return post(`${preUrl}${whitePreUrl}/add`, data || {})
}
export const getWhiteDetail = (data: object) => {
  return post(`${preUrl}${whitePreUrl}/detail`, data || {})
}
export const removeWhite = (data: object) => {
  return post(`${preUrl}${whitePreUrl}/delete`, data || {})
}
export const editWhite = (data: object) => {
  return post(`${preUrl}${whitePreUrl}/edit`, data || {})
}
export const exportWhite = (ids: Array<string>) => {
  return exportFile({
    url: `${preUrl}${whitePreUrl}/export`,
    data: { ids }
  });
}