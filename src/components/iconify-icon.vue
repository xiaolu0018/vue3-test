<template>
  <!-- 动态图标名称 -->
  <Icon :icon="currentIcon" size="32" color="blue" />
</template>

<script setup lang="ts" name="IconifyIcon">
  import { Icon } from '@iconify/vue' // 显式导入 Icon 组件

  const currentIcon = ref('ep-edit') // 动态切换图标（格式：库名-图标名）
</script>
