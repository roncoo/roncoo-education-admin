import request from '@/utils/request'

// 管理员相关接口
// 分页
export function userPage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/system/admin/sys/user/list', {pageCurrent: pageCurrent, pageSize: pageSize, ...params})
}

// 保存
export function userSave(data = {}) {
  return request.post('/system/admin/sys/user/save', data)
}

// 删除
export function userDelete(data = {}) {
  return request.post('/system/admin/sys/user/delete', data)
}

// 更新
export function userUpdate(data = {}) {
  return request.post('/system/admin/sys/user/update', data)
}

// 查看
export function userView(data = {}) {
  return request.post('/system/admin/sys/user/view', data)
}

// 修改密码
export function updatePassword(data = {}) {
  return request.post('/system/admin/sys/user/update/password', data)
}

// 角色用户列出
export function roleUserList(data = {}) {
  return request.post('/system/admin/sys/role/user/list', data)
}

// 角色用户添加
export function roleUserSave(data = {}) {
  return request.post('/system/admin/sys/role/user/save', data)
}

// 角色相关接口
// 分页
export function rolePage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/system/admin/sys/role/list', {pageCurrent: pageCurrent, pageSize: pageSize, ...params})
}

// 添加
export function roleSave(data = {}) {
  return request.post('/system/admin/sys/role/save', data)
}

// 删除
export function roleDelete(data = {}) {
  return request.post('/system/admin/sys/role/delete', data)
}

// 更新
export function roleUpdate(data = {}) {
  return request.post('/system/admin/sys/role/update', data)
}

// 查看
export function roleView(data = {}) {
  return request.post('/system/admin/sys/role/view', data)
}

// 菜单角色相关接口
// 列出
export function menuRoleList(data = {}) {
  return request.post('/system/admin/menu/role/list', data)
}

// 添加
export function menuRoleSave(data = {}) {
  return request.post('/system/admin/sys/menu/role/save', data)
}

// 菜单相关接口
// 列出
export function menuList(data = {}) {
  return request.post('/system/admin/sys/menu/list', data)
}

// 保存
export function menuSave(data = {}) {
  return request.post('/system/admin/sys/menu/save', data)
}

// 删除
export function menuDelete(data = {}) {
  return request.post('/system/admin/sys/menu/delete', data)
}

// 更新
export function menuUpdate(data = {}) {
  return request.post('/system/admin/sys/menu/update', data)
}

// 查看
export function menuView(data = {}) {
  return request.post('/system/admin/sys/menu/view', data)
}

export function enumList(enumName) {
  return request.post('/system/api/enum/view', {enumName})
}

// 用户菜单（登录使用）
export function userMenuList(data) {
  return request.post('/system/admin/sys/menu/user/list', data)
}
