import { post } from '@/utils/request';

const preUrl = '/account';
const preGroupUrl = '/group'

export const loginUse = (data: object) => {
  return post(`${preUrl}/login`, data || {});
};
export const fetchUser = (data: object) => {
  return post(`${preUrl}/info`, data || {})
};
export const getUsers = (data: object) => {
  return post(`${preUrl}/query`, data || {})
};

export const getUserDetail = (data: object) => {
  return post(`${preUrl}/detail`, data || {})
};

export const registUser = (data: object) => {
  return post(`${preUrl}/add`, data || {})
};

export const updateUser = (data: object) => {
  return post(`${preUrl}/edit`, data || {})
};
export const deleteUser = (data: object) => {
  return post(`${preUrl}/delete`, data || {})
}
// 用户操作日志
export const getUserLogs = (data: object) => {
  return post(`${preUrl}/log`, data || {})
}
export const loginOut = () => {
  return post(`${preUrl}/logout`, {})
}
export const disableUser = (data: object) => {
  return post(`${preUrl}/switch`, { ...data, opt: 'off' })
}
export const enableUser = (data: object) => {
  return post(`${preUrl}/switch`, { ...data, opt: 'on' })
}
// 用户组角色权限
export const getGroups = (data: object) => {
  return post(`${preUrl}${preGroupUrl}/query`, data || {})
}

export const getGroupDetail = (data: object) => {
  return post(`${preUrl}${preGroupUrl}/detail`, data || {})
}

export const addGroup = (data: object) => {
  return post(`${preUrl}${preGroupUrl}/add`, data || {})
}

export const editGroup = (data: object) => {
  return post(`${preUrl}${preGroupUrl}/edit`, data || {})
}

export const deleteGroup = (data: object) => {
  return post(`${preUrl}${preGroupUrl}/delete`, data || {})
}

export const getGroupDistribution = () => {
  return post(`${preUrl}${preGroupUrl}/distribution`, {})
}