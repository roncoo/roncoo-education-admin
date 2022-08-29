import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
/* Layout */
import Layout from '@/layout/index.vue'
import mains from '@/layout/components/mains.vue'
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
    meta: { title: '404', icon: 'dashboard' },
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/403.vue'),
    meta: { title: '403', icon: 'dashboard' },
    name: 'Page403',
    isLayout: true,
    hidden: true
  },

]

const asyncRouterMapList = [
  {
    path: '/',
    component: Layout,
    isDashboard: true,
    children: [
      {
        path: 'dashboard',
        name: '概况总览',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '概况总览', icon: 'dashboard' }
      },
      {
        path: '/redirect/:path*',
        name: 'redirect',
        hidden: true,
        component: () => import('@/views/redirect/index.vue')
      },
    ]
  },
  {
    path: '/system',
    redirect: '/system/config/list',
    component: Layout,
    meta: { title: '系统管理', icon: 'dashboard' },
    children: [
      {
        path: 'config/list',
        name: 'SysConfig',
        component: () => import('@/views/system/sysConfig/list/index.vue'),
        meta: { title: '基础配置' }
      },
      {
        path: 'user/list',
        name: 'SysUser',
        component: () => import('@/views/system/sysUser/list/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role/list',
        name: 'SysRole',
        component: () => import('@/views/system/sysRole/list/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'menu/list',
        name: 'SysMenu',
        component: () => import('@/views/system/sysMenu/list/index.vue'),
        meta: { title: '菜单管理', noCache: true }
      },
      {
        path: 'logs/list',
        name: 'SysLog',
        component: () => import('@/views/system/sysLog/index.vue'),
        meta: { title: '操作日志' }
      }
    ]
  },
  { path: '/:pathMatch(.*)', redirect: '/404', isLayout: true, hidden: true },
]

asyncRouterMapList.forEach(e => {
  if (e.component === Layout) {
    e.isLayout = true;
  }
})

export const asyncRouterMap = [...asyncRouterMapList]

const createRouters = (routerList = '') => createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: routerList
})

const router = createRouters(constantRoutes)

export default router


