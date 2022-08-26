import request from '@/utils/request'

// 分页
export function usersPage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/v1/admin/users/page', {pageCurrent: pageCurrent, pageSize: pageSize, ...params});
}

// 查看
export function usersView(id) {
  return request.get(`/v1/admin/users/view?id=${id}`)
}

// 编辑
export function usersEdit(data = {}) {
  return request.put('/v1/admin/users/edit', data)
}

// 添加
export function usersSave(data = {}) {
  return request.post('/v1/admin/users/save', data);
}

// 密码
export function usersPassword(data = {}) {
  return request.put('/v1/admin/users/password', data);
}

// 删除
export function usersDelete(id) {
  return request.delete(`/v1/admin/users/delete?id=${id}`);
}

// 状态
export function usersStatus(id) {
  return request.put(`/v1/admin/users/status?id=${id}`);
}

// 用户信息--概览
export function resume(data = {}) {
  return request.post('/v1/admin/users/resume', data)
}

