import {defineStore} from 'pinia'

export const useUploadStore = defineStore({
    id: 'upload',
    state: () => ({
        fileList: []
    }),
    getters: {
        getFileList(state) {
            return state.fileList
        }
    },
    actions: {
        // 添加文件
        addFile(data: any) {
            this.fileList.push(data)
        },
        // 清空文件
        clearFile() {
            this.fileList = []
        }
    }
})
