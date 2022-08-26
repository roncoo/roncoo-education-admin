import request from '@/utils/request'

// 分类--添加
export function configSave(data = {}) {
  return request.post('/v1/admin/config/save', data)
}

// 分类--查看
export function configView(id) {
  return request.get(`/v1/admin/config/view?id=${id}`)
}

// 分类--删除
export function configDelete(id) {
  return request.delete(`/v1/admin/config/delete?id=${id}`);
}

// 分类--编辑
export function configEdit(data = {}) {
  return request.put('/v1/admin/config/edit', data)
}

// 分类管理--分页
export function configList(params) {
  return request.post('/v1/admin/config/list', {...params})
}
