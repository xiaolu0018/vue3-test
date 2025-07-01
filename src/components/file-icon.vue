<template>
  <Icon :icon="fileIcon" />
</template>

<script setup lang="ts" name="uav-file-icon">
  import { folderIcon, folderOpenIcon } from '@/utils/fileIconMap'
  import { Icon } from '@iconify/vue' // 显式导入 Icon 组件
  const props = defineProps({
    expanded: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: '',
      required: true
    }
  })
  // 文件夹打开关闭切换和文件图标
  const fileIcon = computed(() =>
    [folderIcon, folderOpenIcon].includes(props.icon)
      ? props.expanded
        ? folderOpenIcon
        : folderIcon
      : props.icon
  )
</script>
