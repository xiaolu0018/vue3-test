import { defineStore } from 'pinia'
import type { UploadFile } from 'element-plus'

// 类型定义
export interface FolderFile extends UploadFile {
  relativePath: string
  progress: number
}
export const useUploadStore = defineStore('upload', {
  state: () => ({
    uploadFiles: [] as FolderFile[]
  }),

  getters: {
    uploadProgress: (state) => {
      if (state.uploadFiles.length === 0) return 0
      const total = state.uploadFiles.reduce((sum, file) => sum + file.size, 0)
      const loaded = state.uploadFiles.reduce((sum, file) => sum + (file.size * (file.progress / 100)), 0)
      return Math.round((loaded / total) * 100)
    }
  },

  actions: {
    initUpload(files: FolderFile[]) {
      this.uploadFiles = files.map(file => ({
        ...file,
        status: 'uploading' as const,
        progress: 0
      }))
    },

    updateProgress(uid: number, progress: number) {
      const index = this.uploadFiles.findIndex(f => f.uid === uid)
      if (index > -1) {
        this.uploadFiles[index].progress = progress
      }
    },

    finishFile(uid: number) {
      const index = this.uploadFiles.findIndex(f => f.uid === uid)
      if (index > -1) {
        this.uploadFiles[index].status = 'success'
      }
    },

    markError(uid: number, error: string) {
      const index = this.uploadFiles.findIndex(f => f.uid === uid)
      if (index > -1) {
        this.uploadFiles[index].status = 'fail'
        this.uploadFiles[index].error = error
      }
    }
  }
})
