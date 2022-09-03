import request from '@/utils/request'

// 讲师分页
export function lecturerPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/user/admin/lecturer/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 讲师修改
export function lecturerEdit(data) {
  return request.put('/user/admin/lecturer/edit', data)
}

// 讲师保存
export function lecturerSave(data) {
  return request.post('/user/admin/lecturer/save', data)
}

// 讲师删除
export function lecturerDelete(data) {
  return request.delete('/user/admin/lecturer/delete?id=' + data.id, data)
}

// 用户分页
export function usersPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/user/admin/users/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 用户修改
export function usersEdit(data) {
  return request.put('/user/admin/users/edit', data)
}

// 用户修改
export function usersDelete(data) {
  return request.delete('/user/admin/users/delete?id=' + data.id, data)
}
