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
        login(data: any) {
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
        let cloneParentList = cloneDeep(parentList);
        if (!isEmpty(e.children) && e.menuName) {
            // 递归
            cloneParentList.push({id: menuIdStr, title: e.menuName});
            recursiveMap(e.children, cloneParentList, breadcrumbMaps);
        } else {
            breadcrumbMaps.set(menuIdStr, cloneParentList);
        }
    }
}
