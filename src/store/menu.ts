import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMenu } from '@/utils/menuParse'
import type { MenuState } from '@/types/menu'

export const useMenuStore = defineStore('menu', () => {
  // 状态定义
  const state = ref<MenuState>({
    menuTree: [],
    activeMenu: '/'
  })

  // Getter
  const treeMenu = computed(() => state.value.menuTree)
  const activeMenu = computed(() => state.value.activeMenu)

  // Action
  const initDynamicMenu = async () => {
    try {
      state.value.menuTree = generateMenu([])
    } catch (error) {
      console.error('菜单初始化失败:', error)
    }
  }


  return {
    state,
    treeMenu,
    activeMenu,
    initDynamicMenu
  }
})