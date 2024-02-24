import { cloneDeep, isEmpty } from 'lodash'
import { defineStore } from 'pinia'
import { removeToken } from '@/utils/cookie'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    mobile: '',
    realName: '',
    routerList: [],
    menuList: [],
    permissionList: [],
    breadcrumbMap: new Map()
  }),
  getters: {
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
    },
    getPermissionList(state) {
      return state.permissionList
    },
    getBreadcrumbMap(state) {
      return state.breadcrumbMap
    }
  },
  actions: {
    // 登录操作
    login(data) {
      this.mobile = data.mobile
      this.realName = data.realName
      this.routerList = data.routerList
      this.menuList = data.menuList
      this.permissionList = data.permissionList
      this.breadcrumbMap = buildBreadcrumbMap(data.menuList)
    },

    // logout
    logout() {
      this.routerList = []
      this.menuList = []
      this.breadcrumbMap = new Map()
      removeToken()
    }
  }
})

/**
 * 构建菜单父级集合，面包屑导航
 */
function buildBreadcrumbMap(menuList) {
  let breadcrumbMaps = new Map()
  recursiveMap(menuList, [], breadcrumbMaps)
  return breadcrumbMaps
}
function recursiveMap(menuList, parentList, breadcrumbMaps) {
  for (const e of menuList) {
    if (e.parentId === 0) {
      parentList = []
    }
    let menuIdStr = e.id.toString()
    let cloneParentList = cloneDeep(parentList)
    cloneParentList.push({ id: menuIdStr, title: e.menuName })
    breadcrumbMaps.set(menuIdStr, cloneParentList)
    if (!isEmpty(e.children)) {
      // 递归
      recursiveMap(e.children, cloneParentList, breadcrumbMaps)
    }
  }
}
