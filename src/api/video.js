import request from '@/utils/request'

// 分页
export function videoPage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/v1/admin/video/page', {pageCurrent: pageCurrent, pageSize: pageSize, ...params});
}

// 查看
export function videoView(id) {
  return request.get(`/v1/admin/video/view?id=${id}`)
}

// 编辑
export function videoEdit(data = {}) {
  return request.put('/v1/admin/video/edit', data)
}

// 添加
export function videoSave(data = {}) {
  return request.post('/v1/admin/video/save', data);
}

// 删除
export function videoDelete(id) {
  return request.delete(`/v1/admin/video/delete?id=${id}`);
}


