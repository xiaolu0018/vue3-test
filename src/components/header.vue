<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <el-button
      @click="toggleColsapse"
      :class="['collapse-btn', isCollapse ? 'is-colapsed' : '']"
      link
    >
      <el-icon><Fold /></el-icon>
    </el-button>
    <h2 class="inner-page-title">{{ routeTitle }}</h2>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <el-avatar class="user-avator" :size="30" :src="imgurl" />
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userStore.userName || '' }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item command="user">个人中心</el-dropdown-item> -->
              <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useUserStore } from '@/store/user'
  import imgurl from '../assets/img/img.jpg'
  import { APP_TITLE } from '@/utils/contant'

  const route = useRoute()
  const userStore = useUserStore()

  const routeTitle = computed(() => route?.meta?.title || APP_TITLE)
  // 折叠状态
  const isCollapse = computed(() => !!userStore.menuCollapse)
  // 用户名下拉菜单选择事件
  const handleCommand = (command: string) => {
    if (command == 'loginout') {
      userStore.logout()
    }
  }
  const toggleColsapse = () => {
    userStore.toggleMenuCollapse()
  }
</script>
<style lang="scss" scoped>
  .header {
    flex: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    background: $secondary-color;
    height: $header-height-default;
    color: $text-color;
    box-shadow: $shadow;
    border-radius: 8px;
  }
  .header :deep(.el-menu--horizontal.head-menu) {
    //  flex: 1;
    border-bottom-color: transparent;
    .el-menu-item {
      // font-size: 16px;
      // padding: 0 20px;
      // &:hover {
      //   background-color: var(--header-bg-color);
      // }
      // &.is-active {
      //   background-color: var(--header-bg-color);
      //   color: var(--active-text-color);
      // }
    }
  }
  .header-left {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 100%;
  }

  .logo {
    width: 35px;
  }

  .web-title {
    margin: 0 40px 0 10px;
    font-size: 22px;
  }

  .collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    opacity: 0.8;
    font-size: 22px;
    .el-icon {
      transition: transform 0.3s;
    }
    &.is-colapsed .el-icon {
      transform: rotate(180deg);
    }
  }

  .collapse-btn:hover {
    opacity: 1;
  }

  .header-right {
    float: right;
    padding-right: 50px;
  }

  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }

  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }

  .btn-icon {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--header-text-color);
    margin: 0 5px;
    font-size: 20px;
  }

  .btn-bell-badge {
    position: absolute;
    right: 4px;
    top: 0px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: var(--header-text-color);
  }

  .user-avator {
    margin: 0 10px 0 20px;
  }

  .el-dropdown-link {
    color: var(--header-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }
  .inner-page-title {
    font-weight: 500;
    margin: 0;
  }
</style>
