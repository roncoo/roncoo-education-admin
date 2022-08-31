import request from '@/utils/request'

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
