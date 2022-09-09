import {asyncRouterMap} from '@/router'
import {getUserMenu} from '@/api/login'

function flattenMenu(menu = [], userMenu = {}, path = '') {
  const arr = [];
  menu.forEach(e => {
    let menuPath = e.path
    if (menuPath[0] !== '/' && path !== '/') {
      menuPath = path + '/' + menuPath
    } else {
      menuPath = path + menuPath
    }
    // console.log('menuPath', menuPath)
    if (e.hidden) {
      if (e.children && e.children.length) {
        e.children = flattenMenu(e.children, userMenu, menuPath)
      }
      arr.push(e)
    }
    if (userMenu[menuPath]) {
      e.meta = {
        title: userMenu[menuPath].name,
        targetName: userMenu[menuPath].targetName
      }
      e.fullPath = menuPath;
      e.sort = userMenu[menuPath].sort || 1
      e.children = flattenMenu(e.children, userMenu, menuPath)

      arr.push(e)
    }
  });

  arr.sort((a, b) => {
    return a.sort - b.sort
  });

  return arr
}

const initRouter = (object = {}, list = [], path = '') => {
  list.forEach((e, i) => {
    e.sort = e.sort || i;
    if (!object[path + e.path]) {
      object[path + e.path] = e;
    }

    if (e.children && e.children.length) {
      initRouter(object, e.children, path + e.path)
    }
  })
}

const menu = {
  state: {
    init: false,
    menuArr: [],
    menuSet: {},
    UerMenu: {
      '/:pathMatch(.*)': {
        name: '404页面',
        targetName: 'ad'
      },
      '/': {
        name: '',
        targetName: 'ad'
      }
    }
  },
  mutations: {
    set_system_menu: (state, menu) => {
      state.init = true
      state.menuArr = menu
      state.menuSet = menu
    }
  },
  actions: {
    setMenu({commit, state}) {
      return new Promise((resolve, reject) => {
        // TODO 后续续编辑为从服务器获取，并且做数据处理
        getUserMenu().then(res => {
          res.forEach(e => {
            if (e.path[0] !== '/') {
              e.path = '/' + e.path
            }
          })
          initRouter(state.UerMenu, res, '');
          // console.log('UerMenu', state.UerMenu)
          const router = flattenMenu(asyncRouterMap, state.UerMenu);
          state.UerMenu = {}
          commit('set_system_menu', router)
          resolve(router)
        }).catch(err => {
          console.log('getUserMenu', err)
        })
      })
    }
  }
}

export default menu
