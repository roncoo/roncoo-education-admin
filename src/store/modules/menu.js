import _ from 'lodash'
import * as system from '@/api/system'
import { asyncRouterMap } from '@/router'

function flattenMenu(menu, parents = []) {
  if (Array.isArray(menu)) {
    return menu.map(v => flattenMenu(v, [...parents]))
  } else if (menu) {
    return menu.children ? [{...menu, parents}].concat(flattenMenu(menu.children, [...parents, menu]))
      : [{...menu, parents}]
  }
}

function flattenMenus(menu = [], userMenu = {}, path = '') {
  const arr = [];
  menu.forEach(e => {
    let menuPath = e.path
    if (menuPath[0] !== '/' && path !== '/') {
      menuPath = path + '/' + menuPath
    } else {
      menuPath = path + menuPath
    }
    if (e.children && e.children.length) {
      e.children = flattenMenus(e.children, userMenu, menuPath)
      if (e.children && e.children.length) {
        arr.push(e)
      }
    } else {
      if (userMenu[menuPath]) {
        arr.push(e)
      }
    }
  });

  arr.sort((a, b) => { return a.sort - b.sort });
  return arr
}

const menu = {
  state: {
    init: false,
    menuArr: [],
    menuSet: {}
  },
  mutations: {
    set_system_menu: (state, menu) => {
      state.init = true
      state.menuArr = menu
      state.menuSet = _.keyBy(_.flattenDeep(flattenMenu(menu)), 'path')
    }
  },
  actions: {
    setMenu({commit, state}) {
      return new Promise((resolve, reject) => {
        system.userMenuList().then(res => {
          commit('set_system_menu', res.data)
          const routerlist = flattenMenus(asyncRouterMap, state.menuSet);
          console.log(routerlist)

          resolve(routerlist || [])
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default menu
