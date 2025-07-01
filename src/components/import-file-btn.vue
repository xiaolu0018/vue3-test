<template>
  <el-upload
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleFileChange"
    :accept="AcceptedFileTypes.join(',')"
  >
    <el-button type="primary" size="small" link>导入代码</el-button>
  </el-upload>
</template>

<script setup lang="ts" name="import-file-btn">
  import type { UploadFile, UploadRawFile } from 'element-plus'
  import { AcceptedFileTypes } from '@/utils/fileIconMap'

  const emit = defineEmits(['change'])

  // 文件选择回调
  const handleFileChange = async (uploadFile: UploadFile) => {
    const file = uploadFile.raw // 获取原始 File 对象[4](@ref)
    if (file && file.size > 10 * 1024 * 1024) {
      // 限制文件大小
      ElMessage.warning('文件超过10MB限制')
      return
    }
    const content = await readFileContent(file as UploadRawFile)
    emit('change', content) // 触发父组件的change事件
  }

  // 通用文件读取方法
  const readFileContent = (file: UploadRawFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      // 检测中文编码（参考网页7方案）
      // const encoding = detectFileEncoding(file) || 'UTF-8'
      const encoding = 'UTF-8'
      reader.readAsText(file, encoding)
      reader.onload = (e) => resolve(e?.target?.result)
      reader.onerror = (e) => reject('文件读取失败')
    })
  }

  // 编码检测逻辑（简化版）
  const detectFileEncoding = (file: UploadRawFile) => {
    // 实际项目可引入 jschardet 库精确检测
    return file.name.endsWith('.go') ? 'UTF-8' : 'GB2312'
  }
</script>

<style scoped></style>
