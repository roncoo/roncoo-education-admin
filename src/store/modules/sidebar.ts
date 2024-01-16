import {defineStore} from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    collapse: false
  }),
  getters: {},
  actions: {
    handleCollapse() {
      this.collapse = !this.collapse
    }
  }
})
