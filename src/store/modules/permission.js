import {getUserPermission} from '@/api/login'
import {getSession, removeSession, setSession} from '@/utils/storage'

const state = {
  userPermission: null,
  resetPassword: false
}

const mutations = {
  SAVE: (state, arr) => {
    state.userPermission = arr;
  }
}

const actions = {
  getUserPermission({commit}) {
    return new Promise((resolve, reject) => {
      getUserPermission().then(response => {
        setSession('userPMS', response)
        commit('SAVE', response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  removeUserPermission() {
    this.state.userPermission = null
    removeSession('userPMS')
  },
  initPermission({commit, state, dispatch}) {
    const sessData = getSession('userPMS')
    if (sessData) {
      commit('SAVE', sessData)
    } else {
      dispatch('getUserPermission')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
