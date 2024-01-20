import {defineStore} from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        // 折叠
        isCollapse: true
    }),
    getters: {},
    actions: {
        handleCollapse(data: boolean) {
            this.isCollapse = data
        }
    }
})
