import { getInfo, login } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [],
    svgIconList: [
      {
        'icon': '概况总览',
        'label': '概况总览'
      },
      {
        'icon': '常用功能',
        'label': '常用功能'
      },
      {
        'icon': '课程订单',
        'label': '课程订单'
      },
      {
        'icon': '支付订单',
        'label': '支付订单'
      },
      {
        'icon': '首页管理',
        'label': '首页管理'
      },
      {
        'icon': '头部导航',
        'label': '头部导航'
      },
      {
        'icon': '专区管理',
        'label': '专区管理'
      },
      {
        'icon': '轮播管理',
        'label': '轮播管理'
      },
      {
        'icon': '底部文章',
        'label': '底部文章'
      },
      {
        'icon': '友情链接',
        'label': '友情链接'
      },
      {
        'icon': '课程管理',
        'label': '课程管理'
      },
      {
        'icon': '课程分类',
        'label': '课程分类'
      },
      {
        'icon': '讲师管理',
        'label': '讲师管理'
      },
      {
        'icon': '学员管理',
        'label': '学员管理'
      },
      {
        'icon': '站点管理',
        'label': '站点管理'
      },
      {
        'icon': '站点设置',
        'label': '站点设置'
      },
      {
        'icon': '系统设置',
        'label': '系统设置'
      },
      {
        'icon': '平台管理',
        'label': '平台管理'
      },
      {
        'icon': '应用管理',
        'label': '应用管理'
      },
      {
        'icon': '权限管理',
        'label': '权限管理'
      },
      {
        'icon': '用户管理',
        'label': '用户管理'
      },
      {
        'icon': '角色管理',
        'label': '角色管理'
      },
      {
        'icon': '菜单管理',
        'label': '菜单管理'
      }
    ]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const mobile = userInfo.mobile.trim()
      const clientId = userInfo.clientId.trim()
      const ip = userInfo.ip.trim()
      return new Promise((resolve, reject) => {
        login(mobile, userInfo.password, clientId, ip).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      console.log('-------- 获取用户信息 ---------')
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
