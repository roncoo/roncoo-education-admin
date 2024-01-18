import {createRouter, createWebHashHistory} from 'vue-router'
import Layout from '@/layout/index.vue'
import {useUserStore} from '@/store/modules/user';
import {getToken} from "@/utils/cookie";

// 静态路由
const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/404',
        component: () => import('@/views/404.vue'),
        meta: {title: '404'}
    },
    {
        path: '/403',
        component: () => import('@/views/403.vue'),
        meta: {title: '403'}
    },
    {
        path: '/',
        redirect: '/dashboard',
        component: Layout,
        children: [
            {
                path: '/dashboard',
                meta: {title: '首页'},
                component: () => import('@/views/dashboard/index.vue')
            }
        ]
    }
]

const createRouters = (routerList: any) => createRouter({
    history: createWebHashHistory(),
    scrollBehavior: () => ({y: 0}),
    routes: routerList
})

const router = createRouters(constantRoutes)

// 路由加载前
router.beforeEach(async (to, from, next) => {
    if (to.path === '/login' || to.path === '/404' || to.path === '403') {
        next();
        return;
    }

    if (!getToken()) {
        next({path: '/login'});
        return;
    }

    // 获取路由
    //let toRouterInfo = routerMap.get(to.name);
    next();
})

export default router

// 路由对象
const routerMap = new Map();

// 创建路由
export function createNewRouter(data: any) {
    data = data ? data : useUserStore().routerList || []
    const menuList = data.filter((e: any) => e.path);
    const routerList = [];
    const modules = import.meta.glob('../views/**/**.vue');
    for (const e of menuList) {
        const route = {
            path: e.path,
            name: e.id.toString(),
            meta: {
                // 数据库菜单(页面)id
                id: e.id.toString(),
                // 组件名称
                componentName: e.id.toString(),
                // 菜单展示
                title: e.menuName,
                // 菜单图标展示
                icon: e.menuIcon
            },
            component: {}
        }
        route.component = modules[`../views${e.component}`];
        routerList.push(route);
        routerMap.set(e.id.toString(), route);
    }

    router.addRoute({
        path: '/',
        meta: {},
        component: Layout,
        children: routerList
    });
}
