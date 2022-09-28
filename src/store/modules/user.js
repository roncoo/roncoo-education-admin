import {getInfo, login} from '@/api/login'
import {getToken, removeToken, setToken} from '@/utils/auth'
import lockr from 'lockr'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    websiteLogo: '',
    userInfo: null,
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
        'icon': '课程资源',
        'label': '课程资源'
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
        'icon': '权限管理',
        'label': '权限管理'
      },
      {
        'icon': '配置管理',
        'label': '配置管理'
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
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    return new Promise((resolve, reject) => {
      login({...userInfo}).then(data => {
        //console.log(data);
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        //console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_USER_INFO', data || {})
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

