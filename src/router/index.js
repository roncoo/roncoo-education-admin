import {createRouter, createWebHashHistory} from 'vue-router'
/* Layout */
import Layout from '@/layout/index.vue'
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

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: {title: '404', icon: 'dashboard'},
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/403.vue'),
    meta: {title: '403', icon: 'dashboard'},
    name: 'Page403',
    isLayout: true,
    hidden: true
  }

]

const asyncRouterMapList = [
  {
    path: '/dashboard',
    component: Layout,
    isDashboard: true,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: '/redirect/:path*',
        name: 'redirect',
        hidden: true,
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/common',
    redirect: '/common/order',
    component: Layout,
    children: [
      {
        path: 'order',
        name: 'CommonOrder',
        component: () => import('@/views/common/order/index.vue')
      },
      {
        path: 'zone',
        name: 'CommonZone',
        component: () => import('@/views/common/zone/index.vue')
      },
      {
        path: 'course',
        name: 'ZoneCourse',
        hidden: true,
        component: () => import('@/views/common/zone/course/index.vue'),
        meta: {title: '专区课程'}
      },
      {
        path: 'carousel',
        name: 'CommonCarousel',
        component: () => import('@/views/common/carousel/index.vue')
      },
      {
        path: 'nav',
        name: 'CommonNav',
        component: () => import('@/views/common/nav/index.vue')
      },
      {
        path: 'link',
        name: 'CommonLink',
        component: () => import('@/views/common/link/index.vue')
      }
    ]
  },
  {
    path: '/course',
    redirect: '/course/list',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/course/list/index.vue')
      },
      {
        path: 'chapter',
        name: 'CourseChapter',
        hidden: true,
        component: () => import('@/views/course/list/chapter/index.vue'),
        meta: {title: '章节管理'}
      },
      {
        path: 'record',
        name: 'CourseRecord',
        hidden: true,
        component: () => import('@/views/course/list/record/index.vue'),
        meta: {title: '学习管理'}
      },
      {
        path: 'resource',
        name: 'CourseResource',
        component: () => import('@/views/course/resource/index.vue')
      },
      {
        path: 'category',
        name: 'CourseCategory',
        component: () => import('@/views/course/category/index.vue')
      }
    ]
  },
  {
    path: '/users',
    redirect: '/users/list',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'UsersList',
        component: () => import('@/views/users/list/index.vue')
      },
      {
        path: 'lecturer',
        name: 'UsersLecturer',
        component: () => import('@/views/users/lecturer/index.vue')
      },
      {
        path: 'logLogin',
        name: 'usersLogLogin',
        component: () => import('@/views/users/logLogin/index.vue')
      }
    ]
  },
  {
    path: '/pms',
    redirect: '/pms/user',
    component: Layout,
    children: [
      {
        path: 'config',
        name: 'PmsConfig',
        component: () => import('@/views/system/config/index.vue')
      },
      {
        path: 'user',
        name: 'PmsUser',
        component: () => import('@/views/system/sysUser/list/index.vue')
      },
      {
        path: 'role',
        name: 'PmsRole',
        component: () => import('@/views/system/sysRole/list/index.vue')
      },
      {
        path: 'menu',
        name: 'PmsMenu',
        component: () => import('@/views/system/sysMenu/list/index.vue'),
        meta: {noCache: true}
      }
    ]
  },
  {path: '/:pathMatch(.*)', redirect: '/dashboard', isLayout: true, hidden: true}
]

asyncRouterMapList.forEach(e => {
  if (e.component === Layout) {
    e.isLayout = true;
  }
})

export const asyncRouterMap = [...asyncRouterMapList]

const createRouters = (routerList = '') => createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({y: 0}),
  routes: routerList
})

const router = createRouters(constantRoutes)

export default router


