import request from '@/utils/request'

// 系统菜单--列出
export function sysMenuList(id = 0) {
  return request({url: '/system/admin/sys/menu/list', method: 'post', data: {}})
}

// 系统菜单--新增
export function sysMenuSave(data = {}) {
  return request({url: '/system/admin/sys/menu/save', method: 'post', data: data})
}

// 系统菜单--查看
export function sysMenuView(id) {
  return request({url: '/system/admin/sys/menu/view', method: 'post', data: {id: id}})
}

// 系统菜单--删除
export function sysMenuDelete(id) {
  return request({url: '/system/admin/sys/menu/delete', method: 'post', data: {id: id}})
}

// 系统可用菜单--列出
export function sysMenuAvailableList() {
  return request.get('/system/admin/sys/menu/available/all/list')
}

// 店铺可用菜单 -- 列出
export function sysMenuInfoAvailableList() {
  return request.get('/system/admin/shop/menu/base/available/all/list')
}

// --店铺角色获取可分配菜单
export function sysshopMenuDistributableList(id) {
  return request.get('/user/boss/shop/menu/distributable/list?sid=${id}')
}

// 系统菜单--编辑
export function sysMenuEdit(data = {}) {
  return request({url: '/system/admin/sys/menu/update', method: 'post', data: data})
}

// 系统菜单--状态编辑
export function sysMenuUpdateStatus(data) {
  return request({url: '/system/admin/sys/menu/update/status', method: 'post', data})
}

// 系统权限--新增
export function sysPermissionSave(data = {}) {
  return request({url: '/system/admin/sys/menu/save', method: 'post', data: data})
}

// 系统权限--分页
export function sysPermissionPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/menu/available/all/list', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统权限--编辑
export function sysPermissionEdit(data = {}) {
  return request({url: '/system/admin/sys/menu/update', method: 'post', data: data})
}

// 系统权限--状态编辑
export function sysPermissionUpdateStatus(id, status) {
  return request({url: '/system/admin/sys/menu/update/status', method: 'post', data: {id: id, status: status}})
}

// 系统角色--新增
export function sysRoleSave(data = {}) {
  return request({url: '/system/admin/sys/role/save', method: 'post', data: data})
}

// 获取指定角色的权限
export function sysRoleListSelectMenuAndPermission(id) {
  return request.post('/system/admin/sys/menu/role/list', {roleId: id});
}

// 店铺管理 -- 分配权限获取
export function sysshopMenuIdList(id) {
  return request.get('/system/admin/shop/menu/menu/id/list?sid=${id}')
}

export function sysRoleMenuList(id) {
  return request.get('/user/boss/role/menu/list?roleId=${id}')
}

// 分配菜单
export function sysRoleAllocationMenuAndPermission(data = {}) {
  return request({url: '/system/admin/sys/menu/role/save', method: 'post', data: data});
}

// 店铺角色菜单和权限--分配
export function sysRoleMenuBatchSet(data = {}) {
  return request({url: '/user/boss/role/menu/batch/set', method: 'post', data: data});
}

// 店铺角色菜单和权限--分配
export function sysRoleMenuBatchSetByType(data = {}) {
  return request({url: '/system/admin/shop/menu/batch/allocation/menu', method: 'post', data: data});
}

// 系统角色系统角色菜单和权限--分配
export function sysRoleSetAllocationMenuAndPermission(data = {}) {
  return request({url: '/system/admin/shop/menu/allocation/menu', method: 'post', data: data})
}

// 系统角色--分页
export function sysRolePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/role/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统角色--查看
export function sysRoleView(id) {
  return request.get('/system/admin/sys/role/view?id=${id}')
}

// 系统角色--删除
export function sysRoleDelete(id) {
  return request.delete('/system/admin/sys/role/delete?id=${id}')
}

// 系统角色--编辑
export function sysRoleEdit(data = {}) {
  return request({url: '/system/admin/sys/role/edit', method: 'post', data: data})
}

// 系统角色--状态编辑
export function sysRoleUpdateStatus(id, status) {
  return request({
    url: '/system/admin/sys/role/update/status', method: 'post', data: {id: id, status: status}
  })
}

// 系统角色菜单--新增
export function sysRoleMenuSave(data = {}) {
  return request({url: '/system/admin/sys/role/menu/save', method: 'post', data: data})
}

// 系统角色菜单--分页
export function sysRoleMenuPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/role/menu/list', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统角色菜单--查看
export function sysRoleMenuView(id) {
  return request.get('/system/admin/sys/role/menu/view?id=${id}')
}

// 系统角色菜单--删除
export function sysRoleMenuDelete(id) {
  return request.delete('/system/admin/sys/role/menu/delete?id=${id}')
}

// 系统角色菜单--编辑
export function sysRoleMenuEdit(data = {}) {
  return request({url: '/system/admin/sys/role/menu/edit', method: 'post', data: data})
}

// 系统角色权限--新增
export function sysRolePermissionSave(data = {}) {
  return request({url: '/system/admin/sys/role/permission/save', method: 'post', data: data})
}

// 系统角色权限--分页
export function sysRolePermissionPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/role/permission/list', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统角色权限--查看
export function sysRolePermissionView(id) {
  return request.get('/system/admin/sys/role/permission/view?id=${id}')
}

// 系统角色权限--删除
export function sysRolePermissionDelete(id) {
  return request.delete('/system/admin/sys/role/permission/delete?id=${id}')
}

// 系统角色权限--编辑
export function sysRolePermissionEdit(data = {}) {
  return request({url: '/system/admin/sys/role/permission/edit', method: 'post', data: data})
}

// 系统用户--新增
export function sysUserSave(data = {}) {
  return request({url: '/system/admin/sys/user/save', method: 'post', data: data})
}

// 系统用户--分配角色
export function sysUserAllocationRole(data = {}) {
  return request({url: '/system/admin/sys/user/allocation/role', method: 'post', data: data})
}

// 系统用户--查看已分配角色
export function sysUserListSelectRole(id) {
  return request.get('/system/admin/sys/user/role/id/list?id=${id}')
}

// 系统用户--分页
export function sysUserPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/user/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统用户--查看
export function sysUserView(id) {
  return request.get('/system/admin/sys/user/view?id=${id}')
}

// 系统用户--删除
export function sysUserDelete(id) {
  return request.delete('/system/admin/sys/user/delete?id=${id}')
}

// 系统用户--编辑
export function sysUserEdit(data = {}) {
  return request({url: '/system/admin/sys/user/edit', method: 'post', data: data})
}

export function sysUserResetErrorCount(data = {}) {
  return request({url: '/system/admin/sys/user/reset/login/error/count', method: 'post', data: data})
}

// 系统用户状态--编辑
export function sysUserUpdateStatus(data = {}) {
  return request({url: '/system/admin/sys/user/update/status', method: 'post', data: data})
}

// 系统用户密码--编辑
export function sysUserUpdatePassword(data = {}) {
  return request({url: '/system/admin/sys/user/update/login/pwd', method: 'post', data: data})
}

// 当前用户密码--编辑
export function sysUserUpdatePasswordCurrent(data = {}) {
  return request({url: '/system/admin/sys/user/current/update/login/pwd', method: 'post', data: data})
}

// 系统用户角色--分页
export function sysUserRolePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/user/role/list', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统用户角色--新增
export function sysUserRoleSave(data = {}) {
  return request({url: '/system/admin/sys/user/role/save', method: 'post', data: data})
}

// 系统用户角色--查看
export function sysUserRoleView(id) {
  return request.get('/system/admin/sys/user/role/view?id=${id}')
}

// 系统用户角色--删除
export function sysUserRoleDelete(id) {
  return request.delete('/system/admin/sys/user/role/delete?id=${id}')
}

// 系统用户角色--编辑
export function sysUserRoleEdit(data = {}) {
  return request({url: '/system/admin/sys/user/role/edit', method: 'post', data: data})
}

// 获取枚举
export function enumList(enumName) {
  return request({url: '/system/api/common/enum', method: 'post', data: {enumName: enumName}})
}
