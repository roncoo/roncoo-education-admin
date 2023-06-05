import {createStore} from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import menu from './modules/menu'
import tags from './modules/tags'
import opts from './modules/opts'
import permission from './modules/permission'
import upload from './modules/upload'

const store = createStore({
  modules: {
    app,
    settings,
    user,
    menu,
    tags,
    opts,
    permission,
    upload
  },
  getters
})

export default store
