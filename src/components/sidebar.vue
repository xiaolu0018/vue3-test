<template>
  <el-aside :width="menuCollapse ? '64px' : '260px'" :class="[{ collapsed: menuCollapse }]">
    <div class="sidebar-header">
      <h1 class="logo" @click="goHome">
        <img src="~@/assets/img/logo.png" alt="Logo" />
        <span>{{ APP_TITLE }}</span>
      </h1>
      <!-- <el-button link class="toggle-sidebar" @click="toggleColsapse">
        <el-icon><ArrowLeft /></el-icon>
      </el-button> -->
    </div>
    <sidebar-menu :menu-data="menuData" class="sidebar-menu" />
  </el-aside>
</template>
<script setup lang="ts">
  import SidebarMenu from '@/components/SidebarMenu.vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import { APP_TITLE } from '@/utils/contant'
  const userStore = useUserStore()
  const router = useRouter()

  const menuData = computed(() => userStore.menuData)
  const menuCollapse = computed(() => useUserStore().menuCollapse)
  const toggleColsapse = () => {
    userStore.toggleMenuCollapse()
  }
  const goHome = () => {
    router.push('/')
  }
</script>
<style lang="scss" scoped>
  .sidebar-header {
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $border-color;
    overflow: hidden;
    cursor: pointer;
    background-color: #2a2a2a;
  }

  .logo {
    display: flex;
    align-items: center;
    color: $text-color;
    font-weight: 700;
    font-size: 1.2rem;
    margin: 0;
  }

  .logo img {
    margin-right: 12px;
    height: 30px;
  }

  .el-aside.collapsed {
    .sidebar-header {
      padding: 20px 0;
    }
    .logo span {
      display: none;
    }
  }
  .sidebar-menu {
    height: calc(100% - 75px);
    overflow-y: auto;
  }
</style>
