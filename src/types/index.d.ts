// src/types/index.d.ts
import { ComponentType } from 'vue'
import { Store } from 'pinia'

// 扩展Pinia Store类型
// declare module '@/store/menu' {
//   interface MenuStore extends Store<'menu'> {
//     menuData: Menu[]
//     flatMenu: Menu[]
//     activeMenu: string
//   }
// }

// 扩展路由元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    icon?: string | ComponentType
    roles?: string[]
    single?: boolean
    permissions?: string[]
  }
}
