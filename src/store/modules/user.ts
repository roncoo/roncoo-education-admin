import {cloneDeep, isEmpty} from 'lodash'
import {defineStore} from 'pinia'
import {removeToken} from '@/utils/cookie'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        token: '',
        mobile: '',
        realName: '',
        routerList: [],
        menuList: [],
        breadcrumbMap: new Map()
    }),
    getters: {
        getToken(state) {
            return state.token
        },
        getMobile(state) {
            return state.mobile
        },
        getRealName(state) {
            return state.realName
        },
        getRouterList(state) {
            return state.routerList
        },
        getMenuList(state) {
            return state.menuList
        },
        getBreadcrumbMap(state) {
            return state.breadcrumbMap
        }
    },
    actions: {
        // set token
        setToken(token: any) {
            this.token = token
        },

        // 登录操作
        login(data: any) {
            this.mobile = data.mobile
            this.realName = data.realName
            this.routerList = data.routerList
            this.menuList = data.menuList
            this.breadcrumbMap = buildBreadcrumbMap(data.menuList)
        },

        // logout
        logout() {
            this.token = ''
            this.routerList = []
            this.menuList = []
            removeToken()
        }
    }
})


/**
 * 构建菜单父级集合
 */
function buildBreadcrumbMap(menuTree: any) {
    let breadcrumbMaps = new Map();
    recursiveMap(menuTree, [], breadcrumbMaps);
    return breadcrumbMaps;
}

function recursiveMap(menuList: any, parentList: any, breadcrumbMaps: any) {
    for (const e of menuList) {
        if (e.parentId == 0) {
            parentList = [];
        }
        let menuIdStr = e.id.toString();
        let cloneParentMenuList = cloneDeep(parentList);
        if (!isEmpty(e.children) && e.menuName) {
            // 递归
            cloneParentMenuList.push({name: menuIdStr, title: e.menuName});
            recursiveMap(e.children, cloneParentMenuList, breadcrumbMaps);
        } else {
            breadcrumbMaps.set(menuIdStr, cloneParentMenuList);
        }
    }
}
