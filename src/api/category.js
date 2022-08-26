import request from '@/utils/request'

// 分类--分页
export function categoryPage(params, pageCurrent = 1, pageSize = 20) {
  return request.post('/v1/category/page', {pageCurrent: pageCurrent, pageSize: pageSize, ...params})
}

// 分类--添加
export function categorySave(data = {}) {
  return request.post('/v1/category/save', data)
}

// 分类--查看
export function categoryView(id) {
  return request.get(`/v1/category/view?id=${id}`)
}

// 分类--删除
export function categoryDelete(id) {
  return request.delete(`/v1/category/delete?id=${id}`);
}

// 分类--编辑
export function categoryEdit(data = {}) {
  return request.put('/v1/category/edit', data)
}

// 状态
export function categoryStatus(id) {
  return request.put(`/v1/category/status?id=${id}`);
}

// 分类管理--分页
export function categoryList(params) {
  return request.post('/v1/category/list', {...params})
}
