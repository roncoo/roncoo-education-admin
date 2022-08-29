import {getInfo, login} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import lockr from 'lockr'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        userInfo: null,
        lecturerInfo: null,
        domainUrl: '',
        openCustomizeDomain: '',
        orgInfo: {
            orgName: '加载中'
        },
        svgIconList: [
            {
                'icon': 'sketch',
                'label': '概况'
            },
          {
            'icon': 'common',
            'label': '常用'
          },
          {
            'icon': 'order',
            'label': '订单'
          },
          {
            'icon': 'order2',
            'label': '订单2'
          },
          {
            'icon': 'product',
            'label': '产品'
          },
          {
            'icon': 'product2',
            'label': '产品2'
          },
          {
            'icon': 'notice',
            'label': '通知'
          },
          {
            'icon': 'menu',
            'label': '菜单'
          },
          {
            'icon': 'role',
            'label': '角色'
          },
            {
                'icon': 'shop',
                'label': '店铺'
            },
            {
              'icon': 'shop2',
              'label': '店铺2'
          },
            {
                'icon': 'course',
                'label': '课程'
            },
            {
                'icon': 'exam',
                'label': '考试'
            },
            {
                'icon': 'class',
                'label': '班级'
            },
            {
                'icon': 'user',
                'label': '用户'
            },
            {
                'icon': 'deal',
                'label': '交易'
            },
            {
                'icon': 'marketing',
                'label': '营销'
            },
            {
                'icon': 'statistics',
                'label': '数据'
            },
            {
                'icon': 'system',
                'label': '系统'
            },
            {
                'icon': 'server',
                'label': '服务'
            },
            {
              'icon': 'diamond',
              'label': '钻石'
          },
        ]
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_LECTURER(state, lecturerInfo) {
        lockr.set('__directUser', lecturerInfo.directUser)
        state.lecturerInfo = lecturerInfo
    },
    SET_DOMAIN_URL(state, domainUrl) {
        state.domainUrl = domainUrl
    },
    SET_OPEN_DOMAIN(state, openCustomizeDomain) {
        state.openCustomizeDomain = openCustomizeDomain
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_ORG_INFO: (state, orgInfo) => {
        state.orgInfo = orgInfo
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    // user login
    login({commit}, userInfo) {
        return new Promise((resolve, reject) => {
            login({...userInfo}).then(data => {
                console.log(data);
                commit('SET_TOKEN', data.token)
                // commit('SET_USER_INFO', data)
                setToken(data.token)
                resolve()
            }).catch(error => {
                console.log(error)
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
                commit('SET_NAME', data.nickname)
                // commit('SET_AVATAR', data.headImgUrl)
                commit('SET_USER_INFO', data || {})
                // commit('SET_LECTURER', data.lecturerDTO || {})
                // commit('SET_ORG_INFO', data.orgInfoDTO || {})
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

