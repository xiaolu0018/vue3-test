<template>
  <el-button @click="handleExport" type="primary" size="small" link>导出代码</el-button>
</template>

<script setup lang="ts" name="export-file-btn">
  const props = defineProps({
    data: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: 'exported_code.txt'
    }
  })
  const handleExport = async () => {
    // const codeContent = document.getElementById('code-editor-textarea').value;

    // 创建Blob对象
    const blob = new Blob([props.data], { type: 'text/plain' })

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = props.fileName || 'exported_code.txt' // 默认文件名

    // 添加到文档并触发点击
    document.body.appendChild(a)
    a.click()

    // 清理
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
</script>

<style scoped></style>
