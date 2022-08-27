import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const asyncRouterMap = []
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'dashboard'}
    }]
  },
  // 订单管理
  // {
  //   path: 'order',
  //   component: () => import('@/views/order'),
  //   children: [
  //     {
  //       path: 'info',
  //       component: () => import('@/views/order/info'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 支付日志
  //       path: 'pay',
  //       component: () => import('@/views/order/pay'),
  //       meta: {requireAuth: true}
  //     }
  //   ]
  // },
  // 首页管理
  // {
  //   path: 'homepage',
  //   component: () => import('@/views/homepage'),
  //   children: [
  //     {
  //       path: 'carousel',
  //       component: () => import('@/views/homepage/carousel'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       path: 'zone',
  //       component: () => import('@/views/homepage/zone'),
  //       children: [
  //         {
  //           path: 'list',
  //           component: () => import('@/views/homepage/zone/list'),
  //           meta: {requireAuth: true}
  //         },
  //         {
  //           path: 'course',
  //           component: () => import('@/views/homepage/zone/course'),
  //           meta: {requireAuth: true, title: '专区课程'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'nav',
  //       component: () => import('@/views/homepage/nav'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       path: 'article',
  //       component: () => import('@/views/homepage/article'),
  //       children: [
  //         {
  //           path: 'list',
  //           component: () => import('@/views/homepage/article/list'),
  //           meta: {requireAuth: true}
  //         },
  //         {
  //           path: 'info',
  //           component: () => import('@/views/homepage/article/info'),
  //           meta: {requireAuth: true, title: '文章管理'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'link',
  //       component: () => import('@/views/homepage/link'),
  //       meta: {requireAuth: true}
  //     }
  //   ]
  // },
  // 课程管理
  // {
  //   path: 'course',
  //   component: () => import('@/views/course'),
  //   children: [
  //     {// 课程列表
  //       path: 'list',
  //       component: () => import('@/views/course/list'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 课程审核列表
  //       path: 'audit',
  //       component: () => import('@/views/course/audit'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 课程分类列表
  //       path: 'category',
  //       component: () => import('@/views/course/category'),
  //       meta: {requireAuth: true}
  //     }
  //   ]
  // },
  // 讲师管理
  // {
  //   path: 'lecturer',
  //   component: () => import('@/views/lecturer'),
  //   children: [
  //     {// 讲师列表
  //       path: 'list',
  //       component: () => import('@/views/lecturer/list'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 讲师审核列表
  //       path: 'audit',
  //       component: () => import('@/views/lecturer/audit'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 讲师分润列表
  //       path: 'profit',
  //       component: () => import('@/views/lecturer/profit'),
  //       meta: {requireAuth: true}
  //     }
  //   ]
  // },
  // {
  //   // 学员管理
  //   path: 'user',
  //   component: () => import('@/views/user'),
  //   children: [
  //     // 学员列表
  //     {
  //       path: 'info',
  //       component: () => import('@/views/user/info'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 用户学习日志列表
  //       path: 'study',
  //       component: () => import('@/views/user/study'),
  //       meta: {requireAuth: true}
  //     }
  //   ]
  // },
  // {
  //   // 站点管理
  //   path: 'website',
  //   component: () => import('@/views/website'),
  //   children: [
  //     {
  //       // 站点设置
  //       path: 'config',
  //       component: () => import('@/views/website/config'),
  //       meta: {requireAuth: true}
  //     },
  //     {
  //       // 系统设置
  //       path: 'system',
  //       component: () => import('@/views/website/system'),
  //       meta: {requireAuth: true}
  //     }
  //   ]
  // },
  {
    // 权限管理
    path: 'pms',
    component: () => import('@/views/pms'),
    children: [
      {
        // 用户管理
        path: 'user',
        component: () => import('@/views/pms/user/index'),
        meta: {requireAuth: true}
      },
      {
        // 角色管理
        path: 'role',
        component: () => import('@/views/pms/role/index'),
        meta: {requireAuth: true}
      },
      {
        // 菜单管理
        path: 'menu',
        component: () => import('@/views/pms/menu/index'),
        meta: {requireAuth: true}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard', // 设置登陆系统默认页面
    children: [
      {path: 'iframe', component: () => import('@/views/iframe/index')},
      {path: 'redirect/:path*', name: 'redirect', component: () => import('@/views/redirect/index')},
      ...asyncRouterMap
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
