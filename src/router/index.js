import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store/modules/user'
import { getToken } from '@/utils/cookie'
import { PATH } from '@/utils/constants/system'

// 静态路由
const constantRoutes = [
  {
    path: '/',
    redirect: PATH.URL_DASHBOARD
  },
  {
    path: PATH.URL_LOGIN,
    component: () => import('@/views/login/index.vue')
  },
  {
    path: PATH.URL_404,
    component: () => import('@/views/404.vue'),
    meta: { title: '404' }
  },
  {
    path: PATH.URL_403,
    component: () => import('@/views/403.vue'),
    meta: { title: '403' }
  }
]

const createRouters = (routerList) =>
  createRouter({
    history: createWebHashHistory(),
    routes: routerList,
    strict: true
  })

const router = createRouters(constantRoutes)

// 路由加载前
router.beforeEach(async (to, from, next) => {
  const token = getToken()
  if (!token) {
    if (to.path === PATH.URL_LOGIN) {
      next()
      return
    }
    next({ path: PATH.URL_LOGIN })
    return
  }
  if (to.matched.length === 0) {
    next({ path: PATH.URL_404 })
    return
  }
  next()
})

export default router

// 创建路由
export function createNewRouter(data) {
  data = data ? data : useUserStore().routerList || []
  const menuList = data.filter((e) => e.path)
  const routerList = []
  const modules = import.meta.glob('../views/**/**.vue')
  for (const e of menuList) {
    const route = {
      path: e.path,
      name: e.id.toString(),
      meta: {
        // id
        id: e.id.toString(),
        // 组件名称
        componentName: e.id.toString(),
        // 组件标题
        title: e.menuName,
        // 组件图标
        icon: e.menuIcon
      },
      component: {}
    }
    route.component = modules[`../views${e.component}`]
    routerList.push(route)
  }

  router.addRoute({
    path: '/',
    meta: {},
    component: Layout,
    children: routerList
  })
}
