<!-- src/components/SidebarMenu.vue -->
<template>
  <el-menu
    router
    mode="vertical"
    :collapse="menuCollapse"
    :default-active="activeMenu"
    :default-openeds="openedMenus"
    :collapse-transition="false"
  >
    <template v-for="item in menuData" :key="item.path">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="item.children?.length" :index="item.path">
        <template #title>
          <Icon :icon="item.meta!.icon" />
          <span>{{ item.meta!.title }}</span>
        </template>
        <sidebar-menu :menu-data="item.children" :base-path="resolvePath(item.path)" />
      </el-sub-menu>

      <!-- 无子菜单 -->
      <el-menu-item v-else :index="resolvePath(item.path)">
        <Icon :icon="item.meta!.icon" />
        <span>{{ item.meta!.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue' // 显式导入 Icon 组件
  import type { RouteRecordRaw } from 'vue-router'
  import type { PropType } from 'vue'
  import { useUserStore } from '@/store/user'

  const props = defineProps({
    basePath: { type: String, default: '' }, // 接收父级路径
    menuData: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true
    }
  })
  const route = useRoute()

  const menuCollapse = computed(() => useUserStore().menuCollapse)
  const activeMenu = computed(() => route.path)
  // 计算当前路由的所有父级路径（用于展开父菜单）
  const openedMenus = computed(() => {
    const paths = route.path.split('/').filter(Boolean)
    const result: string[] = []
    let currentPath = ''

    // 递归生成所有父路径（如 /a/b/c → ['/a', '/a/b']）
    paths.forEach((path) => {
      currentPath = currentPath ? `${currentPath}/${path}` : `/${path}`
      result.push(currentPath)
    })

    return result.slice(0, -1) // 排除最后一级（当前激活项）
  })
  // 新增路径解析方法
  const resolvePath = (childPath: string) => {
    // 拼接基础路径 (basePath来自递归传递)
    const base = props.basePath || ''
    // 处理路径格式: /parent + /child → /parent/child
    return `${base}/${childPath}`.replace(/\/+/g, '/')
  }
</script>
<style lang="scss" scoped>
  .el-sub-menu > :deep(.el-menu) {
    padding-left: 20px; /* 子菜单缩进 */
  }
  .el-menu-item > svg,
  .el-sub-menu__title > svg {
    margin-right: 1em;
  }
  .el-menu-item.is-active {
    background-color: var(--el-menu-hover-bg-color);
  }
  .el-menu--collapse {
    .el-menu-item > svg,
    .el-sub-menu__title > svg {
      margin-right: 0;
      width: 1.5em;
      height: 1.5em;
    }
  }
</style>
