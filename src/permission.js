import router from './router/index'
import store from './store'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import defaultSettings from '@/settings'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/403'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {

    document.title = (to.meta.title || '') + '-' + (defaultSettings.title || '在线教育');
    if (store.getters.menuInit === false) {
      try {

        let url = '';
        // 设置菜单
        const routerList = await store.dispatch('setMenu')
        const getUrl = (routerList = []) => {

          let url = '';
          for (var i = 0; i < routerList.length; i++) {
            const e = routerList[i];
            if (e.isLayout) {
              if (e.children && e.children.length) {
                url = getUrl(e.children)
                if (url) {
                  return url;
                }
              }
            } else {
              return e.fullPath
            }
          }
          return url;
        }
        url = getUrl(routerList)
        routerList.forEach(e => {
          if (e.isDashboard) {
            e.redirect = url;
          }
        })

        routerList.forEach(e => router.addRoute(e))

        // console.log(router.getRoutes());
        await store.dispatch('permission/getUserPermission')
        await store.dispatch('user/getInfo')
        if (to.path === '/') {
          next(url)
        }
        next({path: '/redirect' + to.path, query: to.query, replace: true})
      } catch (error) {
        //console.log(error)
        // remove token and go to login page to re-login
        if (process.env.ENV === 'production') {
          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next({
            path: '/login'
          })
          NProgress.done()
        }
      }
    } else if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
      NProgress.done()
    } else {
      next({
        path: '/login'
      })
      // other pages that do not have permission to access are redirected to the login page.
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
