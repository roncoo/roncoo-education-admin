import {defineStore} from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        sidebar: {
            opened: true,
            withoutAnimation: false
        },
        device: 'desktop',
        appLoading: false,
        fixedHeader: false
    }),

    getters: {
        getSidebar(state) {
            return state.sidebar
        }
    }
})
