import { defineStore } from 'pinia'
import type { UaTagType } from '@/types/dyForm'
import type { BaseObject } from '@/types/form-option'
import { getList } from '@/api/server'
import { isValidNumber } from '@/utils'
// 暂时存储数据
export const useCacheStore = defineStore('cache', () => {
  //用户状态 1启用 0 禁用
  const userStatus = ref([
    { id: 1, name: '启用' },
    { id: 0, name: '禁用' }
  ])
  // 权限map
  const permissionModules = ref([
    {
      id: 'system',
      name: '系统权限',
      icon: 'bi:gear-fill',
      permissions: [
        { id: 'system.view', name: '查看系统数据' },
        { id: 'system.config', name: '系统配置' },
        { id: 'system.logs', name: '查看系统日志' },
        { id: 'system.backup', name: '系统备份与恢复' }
      ]
    },
    {
      id: 'account',
      name: '账号权限',
      icon: 'bi:people',
      permissions: [
        { id: 'account.view', name: '查看账号数据' },
        { id: 'account.permission', name: '用户组权限配置' },
      ]
    },
    {
      id: 'server',
      name: '服务器管理',
      icon: 'bi:server',
      permissions: [
        { id: 'server.view', name: '查看服务器' },
        { id: 'server.add', name: '添加服务器' },
        { id: 'server.edit', name: '编辑服务器' },
        { id: 'server.delete', name: '删除服务器' },
        { id: 'server.restart', name: '重启服务器' },
        { id: 'server.config', name: '服务器配置' }
      ]
    },
    {
      id: 'user',
      name: '用户管理',
      icon: 'bi:person-badge',
      permissions: [
        { id: 'player.view', name: '查看玩家' },
        { id: 'player.ban', name: '封禁玩家' },
        { id: 'player.unban', name: '解除封禁' },
        { id: 'player.edit', name: '编辑玩家信息' },
        { id: 'player.whitelist', name: '管理白名单' }
      ]
    },
    {
      id: 'announcement',
      name: '公告管理',
      icon: 'bi:megaphone',
      permissions: [
        { id: 'announcement.view', name: '查看公告' },
        { id: 'announcement.create', name: '创建公告' },
        { id: 'announcement.edit', name: '编辑公告' },
        { id: 'announcement.delete', name: '删除公告' }
      ]
    },
    {
      id: 'activation',
      name: '激活管理',
      icon: 'bi:key',
      permissions: [
        { id: 'activation.view', name: '查看密钥列表' },
        { id: 'activation.generate', name: '生成密钥' },
        { id: 'activation.edit', name: '编辑密钥' },
        { id: 'activation.delete', name: '删除密钥' },
        { id: 'activation.ban', name: '封禁/解封密钥' },
        { id: 'activation.export', name: '导出密钥数据' },
        { id: 'activation.stats', name: '查看激活统计' },
        { id: 'activation.config', name: '激活规则配置' }
      ]
    }
  ])
  const servers = ref<BaseObject[]>([])
  //玩家状态 1在线 0 离线 2 封禁
  const playerStatus = ref([
    { id: 0, name: '离线' },
    { id: 1, name: '离线' },
    { id: 2, name: '在线' }
  ])
  // 封禁时长
  const banPeriods = ref([
    { id: 'temp', name: '临时封禁' },
    // { id: 'week', name: '一周' },
    // { id: 'month', name: '一个月' },
    { id: 'permanent', name: '永久封禁' }
  ])
  // 白名单类型
  const whiteListTypes = ref([
    { id: 'vip', name: 'VIP玩家' },
    { id: 'tester', name: '测试玩家' },
    { id: 'developer', name: '开发人员' },
    { id: 'content', name: '内容创作者' }
  ])


  // getter
  // 状态类标签
  const playerStatusTagMap = {
    0: 'warning' as 'warning',
    1: 'warning' as 'warning',
    2: 'success' as 'success',
  }
  const getPlayerStatusTagTypeAndText = computed(() => {
    return (type: number): {
      tagType: UaTagType,
      text: string
    } => {
      return {
        tagType: playerStatusTagMap[type as keyof typeof playerStatusTagMap] || 'info',
        text: playerStatus.value.find((item) => item.id === type)?.name || '未知'
      }
    }
  })
  // 封禁类型 1 禁言 2 禁止登录
  const banTypes = ref([
    { id: 1, name: '禁言' },
    { id: 2, name: '禁止登录' }
  ])
  const banTypeIconMap = ['bi:mic-mute', 'bi:door-closed']
  const banTypesTagMap = ['warning', 'danger']
  const getBanTypesAndText = computed(() => {
    return (type?: number): {
      tagType: UaTagType,
      text: string
      icon: string
    } => {
      return {
        tagType: typeof type === 'number' ? (banTypesTagMap[type] || 'info') as UaTagType : 'info',
        text: banTypes.value.find((item) => item.id === type)?.name || '未知',
        icon: typeof type === 'number' ? banTypeIconMap[type] || 'bi:info-circle' : 'bi:info-circle',
      }
    }
  })
  // 封禁原因
  const banReasons = ref([
    { id: 'chat', name: '违规聊天' },
    { id: 'abuse', name: '恶意刷屏' },
    { id: 'cheat', name: '外挂作弊' },
    { id: 'violation', name: '恶意破坏' },
    { id: 'harassment', name: '骚扰他人' },
    { id: 'rule', name: '违反游戏规则' },
    { id: 'other', name: '其他' },
  ])
  const banReasonTagMap = {
    chat: 'info' as 'info',
    abuse: 'warning' as 'warning',
    cheat: 'danger' as 'danger',
    violation: 'danger' as 'danger',
    harassment: 'warning' as 'warning',
    rule: 'warning' as 'warning',
    other: 'info' as 'info',
  }
  // 封禁原因标签
  const getBanReasonTagTypeAndText = computed(() => {
    return (type: string): {
      tagType: UaTagType,
      text: string
    } => {
      return {
        tagType: banReasonTagMap[type as keyof typeof banReasonTagMap] || 'info',
        text: banReasons.value.find((item) => item.id === type)?.name || '未知'
      }
    }
  })
  const whiteListTagMap = {
    vip: 'success' as 'success',
    tester: 'danger' as 'danger',
    developer: 'warning' as 'warning',
    content: 'info' as 'info'
  }
  // 白名单类型标签
  const getWhiteListTagTypesAndText = computed(() => {
    return (type: string): {
      tagType: UaTagType,
      text: string
    } => {
      return {
        tagType: whiteListTagMap[type as keyof typeof whiteListTagMap] || 'info',
        text: whiteListTypes.value.find((item) => item.id === type)?.name || '未知'
      }
    }
  })
  // 公告类型
  const announcementTypes = ref([
    { "id": "system", "name": "系统", icon: 'bi:gear' },
    { "id": "activity", "name": "活动", icon: 'bi:calendar-event' },
    { "id": "maintenance", "name": "维护", icon: 'bi:tools' },
    { "id": "compensation", "name": "补偿", icon: 'bi:gift' },
    { "id": "other", "name": "其他", icon: 'bi:info-circle' }
  ])
  const announcementTypeTagMap = {
    system: 'primary' as 'primary',
    activity: 'success' as 'success',
    maintenance: 'danger' as 'danger',
    compensation: 'warning' as 'warning',
    other: 'info' as 'info'
  }
  const announcementTypeIconMap = {
    system: 'bi:gear',
    activity: 'bi:calendar-event',
    maintenance: 'bi:tools',
    compensation: 'bi:gift',
    other: 'bi:info-circle',
  }
  const getAnnouncementTypeAndText = computed(() => {
    return (type?: string): {
      tagType: UaTagType,
      text: string,
      icon: string,
    } => {
      return {
        tagType: announcementTypeTagMap[type as keyof typeof announcementTypeTagMap] || 'info',
        text: announcementTypes.value.find((item) => item.id === type)?.name || '未知',
        icon: announcementTypeIconMap[type as keyof typeof announcementTypeIconMap] || 'bi:gear',
      }
    }
  })
  // 公告状态
  const announcementStatus = ref([
    { "id": 0, name: "待发布" },//"draft"
    { "id": 1, name: '已发布' },//"published"
    { "id": 2, name: '已过期' },//"expired"
    { "id": 3, name: '草稿' },//"pending"
  ])
  const announcementStatusTagMap = ['danger', 'success', 'warning', 'info']

  const getAnnouncementStatusAndText = computed(() => {
    return (type?: number): {
      tagType: UaTagType,
      text: string
    } => {
      return {
        tagType: isValidNumber(type) ? (announcementStatusTagMap[type as number] || 'info') as UaTagType : 'info',
        text: announcementStatus.value.find((item) => item.id === type)?.name || '未知'
      }
    }
  })
  // 公告优先级
  const announcementPriority = ref([
    { "id": 0, "name": "普通" },//"normal"
    { "id": 1, "name": "重要" },//"important"
    { "id": 2, "name": "紧急" }//"urgent"
  ])
  const announcementPriorityTagMap = ['primary', 'warning', 'danger']
  const getAnnouncementPriorityAndText = computed(() => {
    return (type?: number): {
      tagType: UaTagType,
      text: string
    } => {
      return {
        tagType: isValidNumber(type) ? (announcementPriorityTagMap[type as number] || 'info') as UaTagType : 'info',
        text: announcementPriority.value.find((item) => item.id === type)?.name || '未知'
      }
    }
  })
  // 发布形式
  const publishOptions = ref([
    { "id": "login_popup", "name": "登录弹窗显示" },
    { "id": "game_notification", "name": "游戏内通知" },
    { "id": "website_display", "name": "官网展示" },
    { "id": "email_notification", "name": "邮件通知" }
  ])
  const getPublishText = computed(() => {
    return (type?: string): string => {
      return publishOptions.value.find((item) => item.id === type)?.name || '未知'
    }
  })
  // 密钥状态,0:未使用, 1:已使用, 2:已过期, 3:已封禁
  const keyStatus = ref([
    { "id": 0, "name": "未使用" },
    { "id": 1, "name": "已使用" },
    { "id": 2, "name": "已过期" },
    { "id": 3, "name": "已封禁" }
  ])
  const keyStatusTagMap = ['primary', 'success', 'warning', 'danger']
  const getKeyStatusAndText = computed(() => {
    return (type?: number): {
      tagType: UaTagType,
      text: string
    } => {
      return {
        tagType: typeof type === 'number' ? (keyStatusTagMap[type] || 'info') as UaTagType : 'info',
        text: keyStatus.value.find((item) => item.id === type)?.name || '未知'
      }
    }
  })
  const UavTypes = ref({
    attack: '攻击型',
    scout: '侦察型',
    transport: '运输型',
    command: '指挥型',
    multirole: '多功能型'
  })

  // actions
  const fetchServers = async () => {
    try {
      const res = await getList({})
      servers.value = (res.data || []).map((item: BaseObject) => {
        item.id = item.ServerIP || '';
        item.name = item.ServerName || '--'
        return item;
      })
    } catch (error) {
      console.error(error)
    } finally {

    }
  }

  return {
    userStatus,
    permissionModules,
    servers,
    fetchServers,
    playerStatus,
    banReasons,
    banPeriods,
    banReasonTagMap,
    getBanReasonTagTypeAndText,
    playerStatusTagMap,
    getPlayerStatusTagTypeAndText,
    whiteListTypes,
    getWhiteListTagTypesAndText,
    announcementTypes,
    getAnnouncementTypeAndText,
    announcementStatus,
    getAnnouncementStatusAndText,
    announcementPriority,
    getAnnouncementPriorityAndText,
    publishOptions,
    getPublishText,
    keyStatus,
    getKeyStatusAndText,
    banTypes,
    getBanTypesAndText,
    UavTypes
  }
})
