import {defineStore} from 'pinia'
import {getToken, removeToken} from '@/utils/cookie'
import {loginApi} from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {},
    menuInfo: {},
    routerInfo: {}
  }),
  getters: {
    getToken() {
      if (!this.token) {
        this.token = getToken()
      }
      return this.token
    },
    getUserInfo() {
      return this.userInfo
    },
    getMenuInfo() {
      return this.menuInfo
    },
    getRouterInfo() {
      return this.routerInfo
    }
  },
  actions: {
    // set token
    setToken(token) {
      this.token = token
    },

    // set userInfo
    setUserInfo() {
      return new Promise((resolve, reject) => {
        loginApi.getUserInfo().then(res => {
          this.userInfo = res
          resolve(res)
        }).catch(error => {
          console.error(error)
          reject(error)
        })
      })
    },

    setMenuInfo() {
      return new Promise((resolve, reject) => {
        loginApi.getUserMenu().then(res => {
          res.forEach(e => {
            if (e.path[0] !== '/') {
              e.path = '/' + e.path
            }
          })
          this.menuInfo = res;
          resolve(res)
        }).catch(error => {
          console.error(error)
          reject(error)
        })
      })
    },

    setRouterInfo() {
      return new Promise((resolve, reject) => {
        loginApi.getUserPermission().then(res => {
          this.routerInfo = res
          resolve(res)
        }).catch(error => {
          console.error(error)
          reject(error)
        })
      })
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

