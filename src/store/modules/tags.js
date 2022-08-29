const tags = {
  state: {
    visitedViews: [],
    cachedViews: [],
    closeViews: [],
    closeCacheView: null
  },
  mutations: {
    ADD_VISITED_VIEW(state, view) {
      if (!state.visitedViews.some(v => v.key === view.fullPath)) {
        const url = view.path === '/iframe' ? decodeURIComponent(view.query.source) : view.path
        const menu = this.getters.menu.menuSet[url]
        const route = { ...view }
        route.name = undefined
        if(view.name === 'Page403') return
        state.visitedViews.push({
          key: view.fullPath,
          title: menu ? (menu.name || menu.title) : view.meta.title || 'no-name',
          route: route
        })
      }
    },
    ADD_CACHED_VIEW: (state, view) => {
      // state.closeCacheView = null

      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },

    DEL_VISITED_VIEW: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.key === view.key) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW: (state, view) => {
      state.closeCacheView = view.fullPath;
      if (!state.closeViews.includes(view.fullPath)) {
        state.closeViews.push(view.fullPath)
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },

    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.key === view.key) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },

    DEL_ALL_VISITED_VIEWS: state => {
      state.visitedViews = []
    },
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = []
    },
    DEL_CLOSE_CACHED_VIEW: (state, path) => {
      state.closeCacheView = null
      for (const i of state.closeViews) {
        if (i === path) {
          const index = state.closeViews.indexOf(i)
          state.closeViews.shift(index, index + 1)
          break
        }
      }
    },

    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.key === view.key) {
          v = Object.assign(v, view)
          break
        }
      }
    }

  },
  actions: {
    addView({ dispatch }, view) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view) {
      commit('ADD_CACHED_VIEW', view)
    },
    checkCachedView({ state, commit }, view) {
      let path = view ? view.fullPath : '';
      if (view && view.name && view.name === 'redirect') {
        path = view.params.path
      }
      return new Promise(resolve => {
        if (state.closeViews.includes(path)) {
          commit('DEL_CLOSE_CACHED_VIEW', path)
          resolve()
        }
      })
    },
    delView({ dispatch, state }, view) {
      return new Promise(resolve => {
        if (state.visitedViews.length !== 1 ||
          (state.visitedViews.length === 1 && state.visitedViews[0].route.path !== '/dashboard')) {
          dispatch('delVisitedView', view)
          dispatch('delCachedView', view.route || view)
        }
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delVisitedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },

    delOthersViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view)
        dispatch('delOthersCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOthersVisitedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve([...state.cachedViews])
      })
    },

    delAllViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        if (state.visitedViews.length !== 1 ||
          (state.visitedViews.length === 1 && state.visitedViews[0].route.path !== '/dashboard')) {
          dispatch('delAllVisitedViews', view)
          dispatch('delAllCachedViews', view)
        }
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },

    updateVisitedView({ commit }, view) {
      commit('UPDATE_VISITED_VIEW', view)
    }
  }
}

export default tags
