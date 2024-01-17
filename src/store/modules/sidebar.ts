import {defineStore} from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        collapse: false
    }),
    getters: {
        handleCollapse(state) {
            return state.collapse
        }
    },
    actions: {}
})
