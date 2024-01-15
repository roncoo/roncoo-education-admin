import {defineStore} from 'pinia'
import {getToken, removeToken} from '@/utils/cookie'
import {loginApi} from '@/api/login'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: '',
    mobile: '',
    realName: '',
    routerList: [],
    menuList: []
  }),
  getters: {
    getToken(state) {
      if (!state.token) {
        state.token = getToken()
      }
      return this.token
    },
    getMobile(state) {
      return state.mobile
    },
    getRealName(state) {
      return state.realName
    },
    getRouterList(state) {
      return state.routerList
    },
    getMenuList(state) {
      return state.menuList
    }
  },
  actions: {
    // set token
    setToken(token) {
      this.token = token
    },

    // 登录操作
    login(data) {
      this.mobile = data.mobile
      this.realName = data.realName
      this.routerInfo = data.routerList
      this.menuList = data.menuList
    },

    // logout
    logout() {
      this.token = ''
      this.userInfo = {}
      this.menuInfo = {}
      removeToken()
    }
  }
})

