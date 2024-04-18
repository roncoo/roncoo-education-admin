import { defineStore } from 'pinia'
import { loginApi } from '@/api/login.js'

export const useWebsiteStore = defineStore({
  id: 'website',
  state: () => ({
    info: {}
  }),
  getters: {
    getInfo(state) {
      return state.info
    }
  },
  actions: {
    // 登录操作
    init() {
      loginApi.getWebsite().then((res) => {
        this.info = res
      })
    }
  }
})
