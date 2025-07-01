<template>
  <div class="common-layout">
    <el-container class="wrapper">
      <v-sidebar />
      <el-container class="content-box">
        <v-header />
        <el-main class="content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
  import vSidebar from '@/components/sidebar.vue'
  import vHeader from '@/components/header.vue'
</script>

<style lang="scss" scoped>
  .common-layout {
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  .wrapper {
    height: 100%;
    overflow: hidden;
  }
  .content-box {
    padding: 20px;
    overflow: hidden;
    flex-direction: column;
  }

  .content {
    width: 100%;
    padding: 20px 0 0;
    overflow: hidden;
    overflow-y: auto;
  }
</style>
