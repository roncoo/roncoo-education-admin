import {defineStore} from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        // 折叠
        collapse: true
    }),
    getters: {},
    actions: {
        handleCollapse(data) {
            this.collapse = data
        }
    }
})
