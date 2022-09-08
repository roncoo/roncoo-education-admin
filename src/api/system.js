import request from '@/utils/request'

// 系统配置--列出
export function sysConfigList(data) {
  return request({url: '/system/admin/sys/config/list', method: 'post', data: data})
}

// 系统菜单--编辑
export function sysConfigEdit(data = {}) {
  return request({url: '/system/admin/sys/config/edit', method: 'put', data: data})
}

// 系统菜单--列出
export function sysMenuList(id = 0) {
  return request({url: '/system/admin/sys/menu/list', method: 'post', data: {id: id}})
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

// 系统菜单--编辑
export function sysMenuEdit(data = {}) {
  return request({url: '/system/admin/sys/menu/update', method: 'post', data: data})
}

// 系统权限--新增
export function sysPermissionSave(data = {}) {
  return request({url: '/system/admin/sys/menu/save', method: 'post', data: data})
}

// 获取指定角色的权限
export function sysMenuRoleList(id) {
  return request.post('/system/admin/sys/menu/role/list', {roleId: id});
}

// 分配菜单
export function sysRoleAllocationMenuAndPermission(data = {}) {
  return request({url: '/system/admin/sys/menu/role/save', method: 'post', data: data});
}

// 系统角色--分页
export function sysRolePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/role/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统角色--新增
export function sysRoleSave(data = {}) {
  return request({url: '/system/admin/sys/role/save', method: 'post', data: data})
}

// 系统角色--查看
export function sysRoleView(id) {
  return request.post('/system/admin/sys/role/view', {id})
}

// 系统角色--删除
export function sysRoleDelete(id) {
  return request.post('/system/admin/sys/role/delete', {id})
}

// 系统角色--编辑
export function sysRoleEdit(data = {}) {
  return request({url: '/system/admin/sys/role/update', method: 'post', data: data})
}

// 系统角色--状态编辑
export function sysRoleStatusId(id, statusId) {
  return request({
    url: '/system/admin/sys/role/update', method: 'post', data: {id: id, statusId: statusId}
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
  return request.post('/system/admin/sys/role/menu/view', {id})
}

// 系统角色菜单--删除
export function sysRoleMenuDelete(id) {
  return request.post('/system/admin/sys/role/menu/delete', {id})
}

// 系统角色菜单--编辑
export function sysRoleMenuEdit(data = {}) {
  return request({url: '/system/admin/sys/role/menu/update', method: 'post', data: data})
}

// 系统用户--分配角色
export function sysRoleUserSave(data = {}) {
  return request({url: '/system/admin/sys/role/user/save', method: 'post', data: data})
}

// 系统用户--查看已分配角色
export function sysRoleUserList(id) {
  return request.post('/system/admin/sys/role/user/list', {userId: id})
}

// 系统用户--分页
export function sysUserPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/sys/user/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 系统用户--新增
export function sysUserSave(data = {}) {
  return request({url: '/system/admin/sys/user/save', method: 'post', data: data})
}

// 系统用户--查看
export function sysUserView(id) {
  return request.post('/system/admin/sys/user/view', {id})
}

// 系统用户--删除
export function sysUserDelete(id) {
  return request.post('/system/admin/sys/user/delete', {id})
}

// 系统用户--编辑
export function sysUserEdit(data = {}) {
  return request({url: '/system/admin/sys/user/update', method: 'post', data: data})
}

// 系统用户状态--编辑
export function sysUserStatusId(data = {}) {
  return request({url: '/system/admin/sys/user/update', method: 'post', data: data})
}

// 系统用户密码--编辑
export function sysUserPassword(data = {}) {
  return request({url: '/system/admin/sys/user/password', method: 'post', data: data})
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
  return request.post('/system/admin/sys/user/role/view', {id})
}

// 系统用户角色--删除
export function sysUserRoleDelete(id) {
  return request.post('/system/admin/sys/user/role/delete', {id})
}

// 系统用户角色--编辑
export function sysUserRoleEdit(data = {}) {
  return request({url: '/system/admin/sys/user/role/update', method: 'post', data: data})
}

// 获取枚举
export function enumList(enumName) {
  return request({url: '/system/api/common/enum', method: 'post', data: {enumName: enumName}})
}
