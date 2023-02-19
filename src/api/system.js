import request from '@/utils/request'

// 头部导航分页
export function navPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/website/nav/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 头部导航修改
export function navEdit(data) {
  return request.put('/system/admin/website/nav/edit', data)
}

// 头部导航保存
export function navSave(data) {
  return request.post('/system/admin/website/nav/save', data)
}

// 头部导航删除
export function navDelete(data) {
  return request.delete('/system/admin/website/nav/delete?id=' + data.id, data)
}

// 轮播分页
export function carouselPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/website/carousel/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 轮播修改
export function carouselEdit(data) {
  return request.put('/system/admin/website/carousel/edit', data)
}

// 轮播保存
export function carouselSave(data) {
  return request.post('/system/admin/website/carousel/save', data)
}

// 轮播删除
export function carouselDelete(data) {
  return request.delete('/system/admin/website/carousel/delete?id=' + data.id, data)
}

// 文章分页
export function articlePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/website/article/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 文章修改
export function articleEdit(data) {
  return request.put('/system/admin/website/article/edit', data)
}

// 文章保存
export function articleSave(data) {
  return request.post('/system/admin/website/article/save', data)
}

// 文章删除
export function articleDelete(data) {
  return request.delete('/system/admin/website/article/delete?id=' + data.id, data)
}

// 友情链接分页
export function linkPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/system/admin/website/link/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 友情链接修改
export function linkEdit(data) {
  return request.put('/system/admin/website/link/edit', data)
}

// 友情链接保存
export function linkSave(data) {
  return request.post('/system/admin/website/link/save', data)
}

// 友情链接删除
export function linkDelete(data) {
  return request.delete('/system/admin/website/link/delete?id=' + data.id, data)
}

// 视频云初始化
export function videoInit() {
  return request({url: '/system/admin/sys/config/video/init', method: 'get'})
}

// 系统配置--列出
export function sysConfigList(data) {
  return request({url: '/system/admin/sys/config/list', method: 'post', data: data})
}

// 系统配置--编辑
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
  return request({url: '/system/admin/sys/menu/edit', method: 'post', data: data})
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
  return request({url: '/system/admin/sys/role/edit', method: 'post', data: data})
}

// 系统角色--状态编辑
export function sysRoleStatusId(id, statusId) {
  return request({
    url: '/system/admin/sys/role/edit', method: 'post', data: {id: id, statusId: statusId}
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
  return request({url: '/system/admin/sys/role/menu/edit', method: 'post', data: data})
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
  return request({url: '/system/admin/sys/user/edit', method: 'post', data: data})
}

// 系统用户状态--编辑
export function sysUserStatusId(data = {}) {
  return request({url: '/system/admin/sys/user/edit', method: 'post', data: data})
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
  return request({url: '/system/admin/sys/user/role/edit', method: 'post', data: data})
}

// 获取枚举
export function enumList(enumName) {
  return request({url: '/system/api/common/enum', method: 'post', data: {enumName: enumName}})
}
