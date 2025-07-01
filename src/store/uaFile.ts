import { defineStore } from 'pinia'
import type { UaFileItem, UaFileList } from '@/types/file'
export const useFileStore = defineStore('plan', () => {
  // 状态定义
  const fileTree = ref<any>([]) // 文件目录树
  const fileList = ref<UaFileList>([]) // 文件列表
  const currentFile = ref<string>('') // 当前文件名
  const fileEditState = ref<boolean>(false) // 当前文件是否被编辑,并且未保存,默认false|即文件未改动

  // Getter
  const getFile = computed((fileName) => fileList.value.find((item) => item.name === fileName))
  const getFileList = computed(() => fileList.value)
  const getFileEditState = computed(() => fileEditState.value)
  const getCurrentFileName = computed(() => currentFile.value)
  const getCurrentFileContent = computed(() => {
    const file = fileList.value.find((item) => item.name === currentFile.value)
    return file ? file.content : ''
  })
  // Action
  const setFileList = (files: UaFileList) => {
    fileList.value = files || []
  }
  function renameFile(fileName: string, newFileName: string) {
    const file = fileList.value.find((item) => item.name === fileName)
    if (file) {
      file.name = newFileName
      fileEditState.value = true
    }
  }
  function setcurrentFileName(fileName: string) {
    currentFile.value = fileName || ''
  }
  function setFileContent(fileName: string = '', fileContent: string = '') {
    const file = fileList.value.find((item) => item.name === fileName)
    if (file) {
      file.content = fileContent
      fileEditState.value = true
    }
  }
  function addFile(data: UaFileItem) {
    const file = fileList.value.find((item) => item.name === data.name)
    if (!file) {
      fileList.value.push(data)
      fileEditState.value = true
      return true
    } else {
      return false
    }
  }
  function deleteFile(fileName: string) {
    const fileIndex = fileList.value.findIndex((item) => item.name === fileName)
    if (fileIndex !== -1) {
      fileList.value.splice(fileIndex, 1)
      fileEditState.value = true
    }
  }
  function setFileEditState(state: boolean) {
    fileEditState.value = state
  }
  return {
    getFile,
    getFileList,
    getFileEditState,
    getCurrentFileName,
    getCurrentFileContent,
    setFileList,
    renameFile,
    setcurrentFileName,
    setFileContent,
    addFile,
    deleteFile,
    setFileEditState
  }
})