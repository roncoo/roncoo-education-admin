import {defineStore} from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    collapse: true
  }),
  getters: {},
  actions: {
    handleCollapse() {
      this.collapse = !this.collapse
    }
  }
})
