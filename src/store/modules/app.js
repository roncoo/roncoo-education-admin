import Cookies from 'js-cookie'
import { getLocale } from '@/locales/index.js'
import { setLanguage } from '@/utils/localeCookie'

const state = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLocale(),
  appLoading: false,
  resetPassword: false,
  loginImageVerification:false,
}

const mutations = {
  TOGGLE_IMAGEVERIGICATION:(state,isShow)=>{
    state.loginImageVerification = isShow
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_LANGUAGE: (state, language) => {
    state.language = language
    setLanguage(state.language)
  },
  TOGGLE_LOADING: (state, status) => {
    state.appLoading = status
  },
  TOGGLE_RESET: (state, isShow) => {
    state.resetPassword = isShow
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  toggleLanguage({ commit }, language) {
    commit('TOGGLE_LANGUAGE', language)
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleLoading({ commit }, status) {
    commit('TOGGLE_LOADING', status)
  },
  toggleResetPassword({ commit }, isShow) {
    commit('TOGGLE_RESET', isShow)
  },
  toggleImageVerification({ commit }, status) {
    commit('TOGGLE_IMAGEVERIGICATION', status)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
