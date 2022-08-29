import request from '@/utils/request'

// 参数配置--分页
export function sysConfigList(data = {}) {
    return request({
        url: '/base/boss/sys/config/list',
        method: 'post',
        data: data
    })
}

// 参数配置--查看
export function sysConfigView(id) {
    return request.get(`/base/boss/sys/config/view?id=${id}`)
}

// 参数配置--删除
export function sysConfigDelete(id) {
    return request.delete(`/base/boss/sys/config/delete?id=${id}`)
}

// 参数配置--新增
export function sysConfigSave(data = {}) {
    return request({
        url: '/base/boss/sys/config/save',
        method: 'post',
        data: data
    })
}

// 参数配置--编辑
export function sysConfigEdit(data = {}) {
    return request({
        url: '/base/boss/sys/config/edit',
        method: 'put',
        data: data
    })
}

// 参数配置--清空缓存
export function sysConfigDeleteRedis(data = {}) {
    return request({
        url: '/base/boss/sys/config/remove/cache',
        method: 'put',
        data: data
    })
}

// 参数配置--视频云配置同步
export function sysSyncVideoCloudConfig() {
    return request.put('/base/boss/sys/config/sync/video/cloud', {})
}

// 参数配置--存储配置同步
export function sysSyncStorageConfig() {
  return request.put('/base/boss/sys/config/set/bucket/cors', {})
}

// 获取站点信息接口(不登陆访问)
export const getWebsite = (params = {}) => {
    return request.get('/base/api/website/info', params)
}

// 系统菜单--新增
export function sysMenuSave(data = {}) {
    return request({
        url: '/base/boss/sys/menu/save',
        method: 'post',
        data: data
    })
}

// 系统菜单--分页
export function sysMenuPermission(id = 0) {
    return request({
        url: `/base/boss/sys/menu/all/list`,
        method: 'get'
    })
}

// 系统菜单--查看
export function sysMenuView(id) {
    return request.get(`/base/boss/sys/menu/view?id=${id}`)
}

// 系统可用菜单--列出
export function sysMenuAvailableList() {
    return request.get(`/base/boss/sys/menu/available/all/list`)
}

// 店铺可用菜单 -- 列出
export function sysMenuInfoAvailableList() {
    return request.get('/base/boss/shop/menu/base/available/all/list')
}

// --店铺角色获取可分配菜单
export function sysshopMenuDistributableList(id) {
    return request.get(`/user/boss/shop/menu/distributable/list?sid=${id}`)
}

// 系统菜单--删除
export function sysMenuDelete(id) {
    return request.delete(`/base/boss/sys/menu/delete?id=${id}`)
}

// 系统菜单--编辑
export function sysMenuEdit(data = {}) {
    return request({
        url: '/base/boss/sys/menu/edit',
        method: 'put',
        data: data
    })
}

// 系统菜单--状态编辑
export function sysMenuUpdateStatus(data) {
    return request({
        url: '/base/boss/sys/menu/update/status',
        method: 'put',
        data
    })
}

// 系统权限--新增
export function sysPermissionSave(data = {}) {
    return request({
        url: '/base/boss/sys/menu/save',
        method: 'post',
        data: data
    })
}

// 系统权限--分页
export function sysPermissionPage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/base/boss/sys/menu/available/all/list',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 系统权限--查看
export function sysPermissionView(id) {
    return request.get(`/base/boss/sys/menu/view?id=${id}`)
}

// 系统权限--删除
export function sysPermissionDelete(id) {
    return request.delete(`/base/boss/sys/menu/delete?id=${id}`)
}

// 系统权限--编辑
export function sysPermissionEdit(data = {}) {
    return request({
        url: '/base/boss/sys/menu/edit',
        method: 'put',
        data: data
    })
}

// 系统权限--状态编辑
export function sysPermissionUpdateStatus(id, status) {
    return request({
        url: '/base/boss/sys/menu/update/status',
        method: 'put',
        data: {
            id: id,
            status: status
        }
    })
}

// 系统角色--新增
export function sysRoleSave(data = {}) {
    return request({
        url: '/base/boss/sys/role/save',
        method: 'post',
        data: data
    })
}

// 系统角色已分配权限--获取
export function sysRoleListSelectMenuAndPermission(id) {
    return request.get(`/base/boss/sys/role/menu/id/list?roleId=${id}`);
}

// 店铺管理 -- 分配权限获取
export function sysshopMenuIdList(id) {
    return request.get(`/base/boss/shop/menu/menu/id/list?sid=${id}`)
}

export function sysRoleMenuList(id) {
    return request.get(`/user/boss/role/menu/list?roleId=${id}`)
}

// 系统角色系统角色菜单和权限--分配
export function sysRoleAllocationMenuAndPermission(data = {}) {
    return request({
        url: '/base/boss/sys/role/allocation/menu',
        method: 'put',
        data: data
    });
}

// 店铺角色菜单和权限--分配
export function sysRoleMenuBatchSet(data = {}) {
    return request({
        url: '/user/boss/role/menu/batch/set',
        method: 'post',
        data: data
    });
}

// 店铺角色菜单和权限--分配
export function sysRoleMenuBatchSetByType(data = {}) {
    return request({
        url: '/base/boss/shop/menu/batch/allocation/menu',
        method: 'put',
        data: data
    });
}

// 系统角色系统角色菜单和权限--分配
export function sysRoleSetAllocationMenuAndPermission(data = {}) {
    return request({
        url: '/base/boss/shop/menu/allocation/menu',
        method: 'put',
        data: data
    })
}

// 系统角色--分页
export function sysRolePage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/base/boss/sys/role/page',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 系统角色--查看
export function sysRoleView(id) {
    return request.get(`/base/boss/sys/role/view?id=${id}`)
}

// 系统角色--删除
export function sysRoleDelete(id) {
    return request.delete(`/base/boss/sys/role/delete?id=${id}`)
}

// 系统角色--编辑
export function sysRoleEdit(data = {}) {
    return request({
        url: '/base/boss/sys/role/edit',
        method: 'put',
        data: data
    })
}

// 系统角色--状态编辑
export function sysRoleUpdateStatus(id, status) {
    return request({
        url: '/base/boss/sys/role/update/status',
        method: 'put',
        data: {
            id: id,
            status: status
        }
    })
}

// 系统角色菜单--新增
export function sysRoleMenuSave(data = {}) {
    return request({
        url: '/base/boss/sys/role/menu/save',
        method: 'post',
        data: data
    })
}

// 系统角色菜单--分页
export function sysRoleMenuPage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/base/boss/sys/role/menu/list',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 系统角色菜单--查看
export function sysRoleMenuView(id) {
    return request.get(`/base/boss/sys/role/menu/view?id=${id}`)
}

// 系统角色菜单--删除
export function sysRoleMenuDelete(id) {
    return request.delete(`/base/boss/sys/role/menu/delete?id=${id}`)
}

// 系统角色菜单--编辑
export function sysRoleMenuEdit(data = {}) {
    return request({
        url: '/base/boss/sys/role/menu/edit',
        method: 'put',
        data: data
    })
}

// 系统角色权限--新增
export function sysRolePermissionSave(data = {}) {
    return request({
        url: '/base/boss/sys/role/permission/save',
        method: 'post',
        data: data
    })
}

// 系统角色权限--分页
export function sysRolePermissionPage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/base/boss/sys/role/permission/list',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 系统角色权限--查看
export function sysRolePermissionView(id) {
    return request.get(`/base/boss/sys/role/permission/view?id=${id}`)
}

// 系统角色权限--删除
export function sysRolePermissionDelete(id) {
    return request.delete(`/base/boss/sys/role/permission/delete?id=${id}`)
}

// 系统角色权限--编辑
export function sysRolePermissionEdit(data = {}) {
    return request({
        url: '/base/boss/sys/role/permission/edit',
        method: 'put',
        data: data
    })
}

// 系统用户--新增
export function sysUserSave(data = {}) {
    return request({
        url: '/base/boss/sys/user/save',
        method: 'post',
        data: data
    })
}

// 系统用户--分配角色
export function sysUserAllocationRole(data = {}) {
    return request({
        url: '/base/boss/sys/user/allocation/role',
        method: 'put',
        data: data
    })
}

// 系统用户--查看已分配角色
export function sysUserListSelectRole(id) {
    return request.get(`/base/boss/sys/user/role/id/list?id=${id}`)
}

// 系统用户--分页
export function sysUserPage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/base/boss/sys/user/page',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 系统用户--查看
export function sysUserView(id) {
    return request.get(`/base/boss/sys/user/view?id=${id}`)
}

// 系统用户--删除
export function sysUserDelete(id) {
    return request.delete(`/base/boss/sys/user/delete?id=${id}`)
}

// 系统用户--编辑
export function sysUserEdit(data = {}) {
    return request({
        url: '/base/boss/sys/user/edit',
        method: 'put',
        data: data
    })
}

// 系统用户--编辑
export function getUserMenu(data = {}) {
    return request({
        url: '/base/boss/sys/user/current/menu/list',
        method: 'get',
        data: data
    })
}

export function sysUserResetErrorCount(data = {}) {
    return request({
        url: '/base/boss/sys/user/reset/login/error/count',
        method: 'put',
        data: data
    })
}

// 系统用户状态--编辑
export function sysUserUpdateStatus(data = {}) {
    return request({
        url: '/base/boss/sys/user/update/status',
        method: 'put',
        data: data
    })
}

// 系统用户密码--编辑
export function sysUserUpdatePassword(data = {}) {
    return request({
        url: '/base/boss/sys/user/update/login/pwd',
        method: 'put',
        data: data
    })
}

// 当前用户密码--编辑
export function sysUserUpdatePasswordCurrent(data = {}) {
    return request({
        url: '/base/boss/sys/user/current/update/login/pwd',
        method: 'put',
        data: data
    })
}

// 获取用户已分配权限
export function getUserPermission() {
    return request({
        url: `/base/boss/sys/user/current/permission/list`,
        method: 'get'
    })
}



// 系统用户角色--新增
export function sysUserRoleSave(data = {}) {
    return request({
        url: '/base/boss/sys/user/role/save',
        method: 'post',
        data: data
    })
}

// 系统用户角色--分页
export function sysUserRolePage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/base/boss/sys/user/role/list',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 系统用户角色--查看
export function sysUserRoleView(id) {
    return request.get(`/base/boss/sys/user/role/view?id=${id}`)
}

// 系统用户角色--删除
export function sysUserRoleDelete(id) {
    return request.delete(`/base/boss/sys/user/role/delete?id=${id}`)
}

// 系统用户角色--编辑
export function sysUserRoleEdit(data = {}) {
    return request({
        url: '/base/boss/sys/user/role/edit',
        method: 'put',
        data: data
    })
}

// 获取枚举
export function enumList(enumName) {
    return request({
        url: `/base/boss/sys/enum/view?name=${enumName}`,
        method: 'get'
    })
}

// 后台操作日志列表--分页
export function sysLogPage(params, pageCurrent = 1, pageSize = 20) {
    return request({
        url: '/data/boss/boss/log/page',
        method: 'post',
        data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}
    })
}

// 获取图片验证码
export function getCodeImg(){
    return request.get('/base/boss/sys/user/get/image/verification')
}
