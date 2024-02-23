import {cloneDeep, isEmpty} from 'lodash'
import {defineStore} from 'pinia'
import {removeToken} from '@/utils/cookie'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        mobile: '',
        realName: '',
        routerList: [],
        menuList: [],
        breadcrumbMap: new Map()
    }),
    getters: {
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
        // 登录操作
        login(data) {
            this.mobile = data.mobile
            this.realName = data.realName
            this.routerList = data.routerList
            this.menuList = data.menuList
            this.breadcrumbMap = buildBreadcrumbMap(data.menuList)
        },

        // logout
        logout() {
            this.routerList = []
            this.menuList = []
            this.breadcrumbMap = new Map()
            removeToken()
        }
    }
})

/**
 * 构建菜单父级集合，面包屑导航
 */
function buildBreadcrumbMap(menuTree) {
    let breadcrumbMaps = new Map();
    recursiveMap(menuTree, [], breadcrumbMaps);
    return breadcrumbMaps;
}

function recursiveMap(menuList, parentList, breadcrumbMaps) {
    for (const e of menuList) {
        if (e.parentId == 0) {
            parentList = [];
        }
        let menuIdStr = e.id.toString();
        let cloneParentList = cloneDeep(parentList);
        cloneParentList.push({id: menuIdStr, title: e.menuName});
        breadcrumbMaps.set(menuIdStr, cloneParentList);
        if (!isEmpty(e.children)) {
            // 递归
            recursiveMap(e.children, cloneParentList, breadcrumbMaps);
        }
    }
}
