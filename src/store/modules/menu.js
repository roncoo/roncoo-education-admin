import _ from 'lodash'
import * as system from '@/api/system'

function flattenMenu(menu, parents = []) {
  if (Array.isArray(menu)) {
    return menu.map(v => flattenMenu(v, [...parents]))
  } else if (menu) {
    return menu.children ? [{...menu, parents}].concat(flattenMenu(menu.children, [...parents, menu]))
      : [{...menu, parents}]
  }
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
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default menu
