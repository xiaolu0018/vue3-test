interface OpIcon {
  icon: string,
  iconClass: string,
  label: string
}
export const iconMap: { [key: string]: OpIcon } = {
  'add': {
    'label': "添加账号",
    'icon': 'bi:person-plus',
    'iconClass': 'bg-primary'
  },
  'edit': {
    'label': "修改账号",
    'icon': 'bi:pencil-square',
    'iconClass': 'bg-warning'
  },
  'delete': {
    "label": "删除账号",
    'icon': 'bi:trash',
    'iconClass': 'bg-danger'
  },
  // 'add': {
  //   'label': "添加账号",
  //   'icon': 'bi:check-lg',
  //   'iconClass': 'bg-primary'
  // },
  'on': {
    "label": "启用账号",
    'icon': 'bi:check-circle',
    'iconClass': 'bg-success'
  },
  'off': {
    "label": "禁用账号",
    'icon': 'bi:person-dash',
    'iconClass': 'bg-danger'
  },
}

export const getOpIcon = (op: string): OpIcon => iconMap[op] || iconMap.edit

export const permissionMap: { [key: string]: string } = {
  'system': 'bi:gear-fill', // 系统管理
  'server': 'bi:server', // 服务器管理
  'user': 'bi:person-badge', // 用户管理
  'account': 'bi:people', // 玩家管理
  'announcement': 'bi:megaphone', // 公告管理
  'activation': 'bi:key', // 激活管理
  'mail': 'bi:envelope', // 邮件管理
  'competition': 'bi:trophy', // 比赛管理
  'version': 'bi:layout-text-window-reverse', // 版本管理
  'log': 'bi:journal-text', // 日志管理
  'setting': 'bi:gear', // 设置管理
}
export const getPermissionIcon = (permission: string): string => permissionMap[permission] || permissionMap.system
