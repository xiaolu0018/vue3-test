<template>
  <div>
    <input type="file" webkitdirectory directory multiple @change="handleFolderSelect" />
    <div v-if="folderInfo">
      <p>根文件夹名称: {{ folderInfo.rootName }}</p>
      <p>完整根路径: {{ folderInfo.rootPath }}</p>
    </div>
    <div v-if="folderPaths.length">
      <h3>嵌套文件夹结构：</h3>
      <ul>
        <li v-for="(path, index) in folderPaths" :key="index">
          {{ path }}
        </li>
      </ul>
    </div>
    <div v-if="Object.keys(fileCache).length">
      已缓存 {{ Object.keys(fileCache).length }} 个文件
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface FileCache {
    path: string
    content: ArrayBuffer
  }

  interface FolderInfo {
    rootName: string
    rootPath: string
  }

  const fileCache = ref<Record<string, FileCache>>({})
  const folderInfo = ref<FolderInfo | null>(null)
  const folderPaths = ref<string[]>([])

  const extractFolderPaths = (files: FileList): [FolderInfo, Set<string>] => {
    const folderSet = new Set<string>()
    let rootInfo = { rootName: '', rootPath: '' }

    Array.from(files).forEach((file) => {
      const fullPath = file.webkitRelativePath
      const pathSegments = fullPath.split('/')

      // 提取根目录信息（从第一个文件）
      if (!rootInfo.rootName) {
        rootInfo = {
          rootName: pathSegments[0],
          rootPath: pathSegments.slice(0, -1).join('/')
        }
      }

      // 分解嵌套路径（排除文件名）
      const dirPath = pathSegments.slice(0, -1)
      for (let i = 1; i <= dirPath.length; i++) {
        const currentPath = dirPath.slice(0, i).join('/')
        folderSet.add(currentPath)
      }
    })

    return [rootInfo, folderSet]
  }

  const readFileContent = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  const handleFolderSelect = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    // 重置数据
    fileCache.value = {}
    folderInfo.value = null
    folderPaths.value = []

    // 解析文件夹结构
    const [rootInfo, folderSet] = extractFolderPaths(files)
    folderInfo.value = rootInfo
    folderPaths.value = Array.from(folderSet).sort()

    // 读取文件内容
    for (const file of Array.from(files)) {
      const content = await readFileContent(file)
      fileCache.value[file.webkitRelativePath] = {
        path: file.webkitRelativePath,
        content
      }
    }
  }
</script>
