import {login} from '@/api/login'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        svgIconList: [
            {
                'icon': 'zip',
                'label': '压缩'
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
        // const {username, password} = userInfo
        return new Promise((resolve, reject) => {
            login(userInfo).then(response => {
                const {data} = response
                setToken(data.token)
                commit('SET_TOKEN', data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            commit('SET_NAME', 'name')
            commit('SET_AVATAR', 'avatar')
            resolve({})
            // getInfo(state.token).then(response => {
            //   const { data } = response
            //
            //   if (!data) {
            //     reject('Verification failed, please Login again.')
            //   }
            //
            //   const { name, avatar } = data
            //
            //   commit('SET_NAME', name)
            //   commit('SET_AVATAR', avatar)
            //   resolve(data)
            // }).catch(error => {
            //   reject(error)
            // })
        })
    },

    // user logout
    logout({commit, state}) {
        return new Promise((resolve, reject) => {
            // must remove  token  first
            removeToken()
            resetRouter()
            commit('RESET_STATE')
            resolve()
            // logout(state.token).then(() => {
            //   removeToken() // must remove  token  first
            //   resetRouter()
            //   commit('RESET_STATE')
            //   resolve()
            // }).catch(error => {
            //   reject(error)
            // })
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

