import request from '@/utils/request'

// --- 订单相关接口
// 分页
export function orderPage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/user/admin/order/info/page', {pageCurrent: pageCurrent, pageSize: pageSize, ...params})
}

// 更新
export function orderUpdate(data = {}) {
  return request.post('/course/pc/order/info/update', data)
}

// 查看
export function orderView(id) {
  return request.post('/course/pc/order/info/view', {id})
}

// --- 用户相关接口
// 分页
export function usersPage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/system/admin/users/page', {pageCurrent: pageCurrent, pageSize: pageSize, ...params});
}

// 查看
export function usersView(id) {
  return request.get(`/system/admin/users/view?id=${id}`)
}

// 编辑
export function usersEdit(data = {}) {
  return request.put('/system/admin/users/edit', data)
}

// 添加
export function usersSave(data = {}) {
  return request.post('/system/admin/users/save', data);
}

// 密码
export function usersPassword(data = {}) {
  return request.put('/system/admin/users/password', data);
}

// 删除
export function usersDelete(id) {
  return request.delete(`/system/admin/users/delete?id=${id}`);
}

// 状态
export function usersStatus(id) {
  return request.put(`/system/admin/users/status?id=${id}`);
}

// 用户信息--概览
export function resume(data = {}) {
  return request.post('/system/admin/users/resume', data)
}

