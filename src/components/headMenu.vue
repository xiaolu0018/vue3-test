<!-- src/components/NavMenu.vue -->
<template>
  <el-menu
    class="head-menu"
    :default-active="activeMenu"
    router
    :collapse="false"
    mode="horizontal"
    :ellipsis="false"
    unique-opened
  >
    <el-menu-item v-for="item in menuStore.treeMenu" :key="item.path" :index="item.path">
      <!-- <i :class="item.meta.icon || 'el-icon-menu'"></i> -->
      {{ item.meta.title }}
    </el-menu-item>
  </el-menu>
</template>

<script setup>
  import { useMenuStore } from '@/store/menu'

  const route = useRoute()

  const menuStore = useMenuStore()
  const activeMenu = computed(() => route.path || route.name || '/')
</script>
