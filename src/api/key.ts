import { post } from '@/utils/request';
import { exportFile } from '@/utils/fetchFile';

const preUrl = '/activate/activate-manager';

// 密钥列表
export const getList = (data: object) => {
  return post(`${preUrl}/find-uav-keys`, data || {}, undefined, { timeout: 0 })
};
// 密钥数据统计
export const getStatic = (data: object) => {
  return post(`${preUrl}/keys-statistics`, data || {}, undefined, { timeout: 0 })
};
export const getDetail = (data: object) => {
  return post(`${preUrl}/detail`, data || {})
};

export const add = (data: object) => {
  return post(`${preUrl}/generate-uav-keys`, data || {}, undefined, { timeout: 0 })
};

export const edit = (data: object) => {
  return post(`${preUrl}/edit-keys`, data || {})
};
export const remove = (data: object) => {
  return post(`${preUrl}/delete`, data || {})
}
export const banned = (data: object) => {
  return post(`${preUrl}/lock-keys`, data || {})
}
export const unBanned = (data: object) => {
  return post(`${preUrl}/un-lock-keys`, data || {})
}
export const exportKey = (ids: Array<string>) => {
  return exportFile({
    url: `${preUrl}/export`,
    data: { ids }
  });
}