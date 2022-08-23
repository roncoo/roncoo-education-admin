import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)

export const asyncRouterMap = [
  {
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    // 当菜单文件中没有该页面配置时，在标签栏显示的就是这里配置的标题
    meta: { title: '首页' }
  },
  //订单管理
  {
    path: 'order',
    component: () => import('@/views/order'),
    children: [
      {
        path: 'info',
        component: () => import('@/views/order/info'),
        meta: { requireAuth: true }
      }
    ]
  },
  //首页管理
  {
    path: 'homepage',
    component: () => import('@/views/homepage'),
    children: [
      {
        path: 'carousel',
        component: () => import('@/views/homepage/carousel'),
        meta: { requireAuth: true }
      },
      {
        path: 'zone',
        component: () => import('@/views/homepage/zone'),
        children: [
          {
            path: 'course',
            meta: { title: '专区课程' },
            component: () => import('@/views/homepage/zone/course')
          }
        ]
      },
      {
        path: 'website',
        component: () => import('@/views/homepage/website'),
        children: [
          {
            path: 'websiteNav',
            component: () => import('@/views/homepage/website/websiteNav'),
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: 'nav',
        component: () => import('@/views/homepage/nav'),
        meta: { requireAuth: true }
      },
      {
        path: 'article',
        component: () => import('@/views/homepage/article'),
        meta: { requireAuth: true }
      },
      {
        path: 'link',
        component: () => import('@/views/homepage/link'),
        meta: { requireAuth: true }
      }
    ]
  },
  //课程管理
  {
    path: 'course',
    component: () => import('@/views/course'),
    children: [
      {// 课程列表
        path: 'list',
        component: () => import('@/views/course/list'),
        meta: { requireAuth: true }
      },
      {
        // 课程审核列表
        path: 'audit',
        component: () => import('@/views/course/audit'),
        meta: { requireAuth: true }
      },
      {
        // 课程分类列表
        path: 'category',
        component: () => import('@/views/course/category'),
        meta: { requireAuth: true }
      }
    ]
  },
  // 讲师管理
  {
    path: 'lecturer',
    component: () => import('@/views/lecturer'),
    children: [
      {// 讲师列表
        path: 'list',
        component: () => import('@/views/lecturer/list'),
        meta: { requireAuth: true }
      },
      {
        // 讲师审核列表
        path: 'audit',
        component: () => import('@/views/lecturer/audit'),
        meta: { requireAuth: true }
      },
      {
        // 讲师分润列表
        path: 'profit',
        component: () => import('@/views/lecturer/profit'),
        meta: { requireAuth: true }
      }
    ]
  },
  {
    // 学员管理
    path: 'user',
    component: () => import('@/views/user'),
    children: [
      // 学员列表
      {
        path: 'info',
        component: () => import('@/views/user/info'),
        meta: { requireAuth: true }
      },
      {
        // 用户学习日志列表
        path: 'studyLog',
        meta: { title: '学习日志' },
        component: () => import('@/views/user/studyLog')
      }
    ]
  },
  {
    // 站点管理
    path: 'website',
    component: () => import('@/views/website'),
    children: [
      {
        // 站点设置
        path: 'config',
        component: () => import('@/views/website/config'),
        meta: { requireAuth: true }
      },
      {
        // 系统设置
        path: 'system',
        component: () => import('@/views/website/system'),
        meta: { requireAuth: true }
      }
    ]
  },
  {
    // 平台管理
    path: 'platform',
    component: () => import('@/views/platform'),
    children: [
      {
        // 应用管理
        path: 'list',
        component: () => import('@/views/platform/list'),
        meta: { requireAuth: true }
      }
    ]
  },
  {
    // 权限管理
    path: 'pms',
    component: () => import('@/views/pms'),
    children: [
      {
        // 用户管理
        path: 'user',
        component: () => import('@/views/pms/user'),
        meta: { requireAuth: true }
      },
      {
        // 角色管理
        path: 'role',
        component: () => import('@/views/pms/role'),
        meta: { requireAuth: true }
      },
      {
        // 菜单管理
        path: 'menu',
        component: () => import('@/views/pms/menu'),
        meta: { requireAuth: true }
      }
    ]
  },
  //系统管理
  {
    path: 'sys',
    component: () => import('@/views/sys'),
    children: [
      {// 消息管理
        path: 'msg',
        component: () => import('@/views/sys/msg'),
        children: [
          {
            // 消息管理
            path: 'template',
            component: () => import('@/views/sys/msg/template'),
            meta: { requireAuth: true }
          },
          {
            // 用户消息
            path: 'msgUser',
            component: () => import('@/views/sys/msg/msgUser'),
            meta: { requireAuth: true }
          },
          {
            // 站点消息
            path: 'msg',
            component: () => import('@/views/sys/msg/msg'),
            meta: { requireAuth: true }
          }
        ]
      },
      {// 日志查看
        path: 'log',
        component: () => import('@/views/sys/log'),
        children: [
          {
            // 系统操作日志
            path: 'sys',
            component: () => import('@/views/sys/log/sys'),
            meta: { requireAuth: true }
          },
          {
            // 支付日志
            path: 'orderPay',
            component: () => import('@/views/sys/log/orderPay'),
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  }
]

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index') },
  { path: '*', component: () => import('@/views/404') },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard', // 设置登陆系统默认页面
    children: [
      { path: 'iframe', component: () => import('@/views/iframe/index') },
      { path: 'redirect/:path*', component: () => import('@/views/redirect/index') },
      ...asyncRouterMap
    ]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
