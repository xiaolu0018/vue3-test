import { RouteRecordRaw } from 'vue-router'

// 菜单项基础类型
export interface BaseMenuItem {
  path: string
  name: string
  redirect?: string
  meta?: {
    title: string | undefined
    icon?: string
    roles?: string[]
    affix?: boolean
    keepAlive?: boolean
    hidden?: boolean
    noAuth?: boolean
    hideInMenu?: boolean
    single?: boolean
    permiss?: string
  }
  component?: string | (() => Promise<typeof import('*.vue')>)
}

// 完整菜单类型（支持递归）
export interface MenuItem extends BaseMenuItem {
  children?: MenuItem[]
}

// 扩展路由类型
export type AppRouteRecordRaw = Omit<RouteRecordRaw, 'meta' | 'children'> & {
  meta?: BaseMenuItem['meta']
  children?: AppRouteRecordRaw[]
}

// 菜单状态类型
export interface MenuState {
  menuTree: MenuItem[]
  activeMenu: string
}