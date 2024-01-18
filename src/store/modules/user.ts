import {defineStore} from 'pinia'
import {removeToken} from '@/utils/cookie'

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
            return state.token
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
        setToken(token: any) {
            this.token = token
        },

        // 登录操作
        login(data: any) {
            this.mobile = data.mobile
            this.realName = data.realName
            this.routerList = data.routerList
            this.menuList = data.menuList
        },

        // logout
        logout() {
            this.token = ''
            this.routerList = []
            this.menuList = []
            removeToken()
        }
    }
})

