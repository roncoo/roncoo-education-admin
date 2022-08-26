import Vue from 'vue'
import Vuex from 'vuex'
import getters from './modules/getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import menu from './modules/menu'
import opts from './modules/opts'
import tags from './modules/tags'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    menu,
    opts,
    tags
  },
  getters
})

export default store
