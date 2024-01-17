import {deleteRequest, getRequest, postRequest, putRequest} from '@/utils/request'

export const systemApi = {
    getEnum: (data: {}) => {
        return postRequest('/system/api/common/enum', data)
    },

    // 头部导航分页
    navPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/website/nav/page', {pageCurrent, pageSize, ...params})
    },

    // 头部导航修改
    navEdit: (data: any) => {
        return putRequest('/system/admin/website/nav/edit', data)
    },

// 头部导航保存
    navSave: (data: any) => {
        return postRequest('/system/admin/website/nav/save', data)
    },

// 头部导航删除
    navDelete: (data: any) => {
        return deleteRequest('/system/admin/website/nav/delete?id=' + data.id)
    },

// 轮播分页
    carouselPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/website/carousel/page', {pageCurrent, pageSize, ...params})
    },

// 轮播修改
    carouselEdit: (data: any) => {
        return putRequest('/system/admin/website/carousel/edit', data)
    },

// 轮播保存
    carouselSave: (data: any) => {
        return postRequest('/system/admin/website/carousel/save', data)
    },

// 轮播删除
    carouselDelete: (data: any) => {
        return deleteRequest('/system/admin/website/carousel/delete?id=' + data.id)
    },

// 文章分页
    articlePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/website/article/page', {pageCurrent, pageSize, ...params})
    },

// 文章修改
    articleEdit: (data: any) => {
        return putRequest('/system/admin/website/article/edit', data)
    },

// 文章保存
    articleSave: (data: any) => {
        return postRequest('/system/admin/website/article/save', data)
    },

// 文章删除
    articleDelete: (data: any) => {
        return deleteRequest('/system/admin/website/article/delete?id=' + data.id)
    },

// 友情链接分页
    linkPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/website/link/page', {pageCurrent, pageSize, ...params})
    },

// 友情链接修改
    linkEdit: (data: any) => {
        return putRequest('/system/admin/website/link/edit', data)
    },

// 友情链接保存
    linkSave: (data: any) => {
        return postRequest('/system/admin/website/link/save', data)
    },

// 友情链接删除
    linkDelete: (data: any) => {
        return deleteRequest('/system/admin/website/link/delete?id=' + data.id)
    },

// 视频云初始化
    videoInit: () => {
        return getRequest('/system/admin/sys/config/video/init')
    },

// 系统配置--列出
    sysConfigList: (data: any) => {
        return postRequest('/system/admin/sys/config/list', data)
    },

// 系统配置--编辑
    sysConfigEdit: (data: any) => {
        return putRequest('/system/admin/sys/config/edit', data)
    },

// 系统菜单--列出
    sysMenuList: (data: any) => {
        return postRequest('/system/admin/sys/menu/list', data)
    },

// 系统菜单--新增
    sysMenuSave: (data: any) => {
        return postRequest('/system/admin/sys/menu/save', data)
    },

// 系统菜单--查看
    sysMenuView: (data: any) => {
        return postRequest('/system/admin/sys/menu/view', data)
    },

// 系统菜单--删除
    sysMenuDelete: (data: any) => {
        return deleteRequest('/system/admin/sys/menu/delete' + data.id)
    },

// 系统菜单--编辑
    sysMenuEdit: (data: any) => {
        return putRequest('/system/admin/sys/menu/edit', data)
    },

// 系统权限--新增
    sysPermissionSave: (data: any) => {
        return postRequest('/system/admin/sys/menu/save', data)
    },

// 获取指定角色的权限
    sysMenuRoleList: (data: any) => {
        return postRequest('/system/admin/sys/menu/role/list', data);
    },

// 分配菜单
    sysRoleAllocationMenuAndPermission: (data: any) => {
        return postRequest('/system/admin/sys/menu/role/save', data);
    },

// 系统角色--分页
    sysRolePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/sys/role/page', {pageCurrent, pageSize, ...params})
    },

// 系统角色--新增
    sysRoleSave: (data: any) => {
        return postRequest('/system/admin/sys/role/save', data)
    },

// 系统角色--查看
    sysRoleView: (data: any) => {
        return postRequest('/system/admin/sys/role/view', data)
    },

// 系统角色--删除
    sysRoleDelete: (data: any) => {
        return postRequest('/system/admin/sys/role/delete', data)
    },

// 系统角色--编辑
    sysRoleEdit: (data: any) => {
        return putRequest('/system/admin/sys/role/edit', data)
    },

// 系统角色--状态编辑
    sysRoleStatusId: (data: any) => {
        return postRequest('/system/admin/sys/role/edit', data)
    },

// 系统角色菜单--新增
    sysRoleMenuSave: (data: any) => {
        return postRequest('/system/admin/sys/role/menu/save', data)
    },

// 系统角色菜单--分页
    sysRoleMenuPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/sys/role/menu/list', {pageCurrent, pageSize, ...params})
    },

// 系统角色菜单--查看
    sysRoleMenuView: (data: any) => {
        return postRequest('/system/admin/sys/role/menu/view', data)
    },

// 系统角色菜单--删除
    sysRoleMenuDelete: (data: any) => {
        return deleteRequest('/system/admin/sys/role/menu/delete/' + data.id)
    },

// 系统角色菜单--编辑
    sysRoleMenuEdit: (data: any) => {
        return putRequest('/system/admin/sys/role/menu/edit', data)
    },

// 系统用户--分配角色
    sysRoleUserSave: (data: any) => {
        return postRequest('/system/admin/sys/role/user/save', data)
    },

// 系统用户--查看已分配角色
    sysRoleUserList: (data: any) => {
        return postRequest('/system/admin/sys/role/user/list', data)
    },

// 系统用户--分页
    sysUserPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/sys/user/page', {pageCurrent, pageSize, ...params})
    },

// 系统用户--新增
    sysUserSave: (data: any) => {
        return postRequest('/system/admin/sys/user/save', data)
    },

// 系统用户--查看
    sysUserView: (data: any) => {
        return postRequest('/system/admin/sys/user/view', data)
    },

// 系统用户--删除
    sysUserDelete: (data: any) => {
        return postRequest('/system/admin/sys/user/delete', data)
    },

// 系统用户--编辑
    sysUserEdit: (data: any) => {
        return putRequest('/system/admin/sys/user/edit', data)
    },

// 系统用户状态--编辑
    sysUserStatusId: (data: any) => {
        return postRequest('/system/admin/sys/user/edit', data)
    },

// 系统用户密码--编辑
    sysUserPassword: (data: any) => {
        return postRequest('/system/admin/sys/user/password', data)
    },

// 系统用户角色--分页
    sysUserRolePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/system/admin/sys/user/role/list', {pageCurrent, pageSize, ...params})
    },

// 系统用户角色--新增
    sysUserRoleSave: (data: any) => {
        return postRequest('/system/admin/sys/user/role/save', data)
    },

// 系统用户角色--查看
    sysUserRoleView: (data: any) => {
        return postRequest('/system/admin/sys/user/role/view', data)
    },

// 系统用户角色--删除
    sysUserRoleDelete: (data: any) => {
        return postRequest('/system/admin/sys/user/role/delete', data)
    },

// 系统用户角色--编辑
    sysUserRoleEdit: (data: any) => {
        return putRequest('/system/admin/sys/user/role/edit', data)
    }
}

