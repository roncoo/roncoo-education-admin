import { defineStore } from 'pinia'

export const useUploadStore = defineStore({
  id: 'upload',
  state: () => ({
    fileList: [],
    successFileList: []
  }),
  getters: {
    getFileList(state) {
      return state.fileList
    },
    getSuccessFileList(state) {
      return state.successFileList
    }
  },
  actions: {
    // 添加文件
    addFile(data) {
      this.fileList.push(data)
    },
    addSuccessFile(data) {
      this.successFileList.push(data)
    },
    // 清空文件
    clearFile() {
      this.fileList.splice(0, this.fileList.length)
    },
    clearSuccessFile() {
      this.successFileList.splice(0, this.successFileList.length)
    }
  }
})
