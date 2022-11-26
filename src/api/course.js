import request from '@/utils/request'

// 专区课程分页
export function zoneCoursePage(data) {
  return request({url: '/course/admin/zone/course/page', method: 'post', data})
}

// 专区课程修改
export function zoneCourseEdit(data) {
  return request.put('/course/admin/zone/course/edit', data)
}

// 专区课程保存
export function zoneCourseSave(data) {
  return request.post('/course/admin/zone/course/save', data)
}

// 专区课程修改
export function zoneCourseDelete(data) {
  return request.delete('/course/admin/zone/course/delete?id=' + data.id, data)
}

// 专区分页
export function zonePage(data) {
  return request({url: '/course/admin/zone/page', method: 'post', data})
}

// 专区修改
export function zoneEdit(data) {
  return request.put('/course/admin/zone/edit', data)
}

// 专区保存
export function zoneSave(data) {
  return request.post('/course/admin/zone/save', data)
}

// 专区修改
export function zoneDelete(data) {
  return request.delete('/course/admin/zone/delete?id=' + data.id, data)
}

// 分类列表
export function categoryList(data) {
  return request({url: '/course/admin/category/list', method: 'post', data: data})
}

// 分类修改
export function categoryEdit(data) {
  return request.put('/course/admin/category/edit', data)
}

// 分类保存
export function categorySave(data) {
  return request.post('/course/admin/category/save', data)
}

// 分类修改
export function categoryDelete(data) {
  return request.delete('/course/admin/category/delete?id=' + data.id, data)
}

// 资源分页
export function resourcePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/course/admin/resource/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 资源修改
export function resourceEdit(data) {
  return request.put('/course/admin/resource/edit', data)
}

// 资源保存
export function resourceSave(data) {
  return request.post('/course/admin/resource/save', data)
}

// 资源修改
export function resourceDelete(data) {
  return request.delete('/course/admin/resource/delete?id=' + data.id, data)
}

// 课程章节分页
export function courseChapterPeriodPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/course/admin/course/chapter/period/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 课程章节修改
export function courseChapterPeriodEdit(data) {
  return request.put('/course/admin/course/chapter/period/edit', data)
}

// 课程章节保存
export function courseChapterPeriodSave(data) {
  return request.post('/course/admin/course/chapter/period/save', data)
}

// 课程章节修改
export function courseChapterPeriodDelete(data) {
  return request.delete('/course/admin/course/chapter/period/delete?id=' + data.id, data)
}

// 课程章分页
export function courseChapterPage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/course/admin/course/chapter/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 课程章修改
export function courseChapterEdit(data) {
  return request.put('/course/admin/course/chapter/edit', data)
}

// 课程章保存
export function courseChapterSave(data) {
  return request.post('/course/admin/course/chapter/save', data)
}

// 课程章修改
export function courseChapterDelete(data) {
  return request.delete('/course/admin/course/chapter/delete?id=' + data.id, data)
}

// 课程分页
export function coursePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/course/admin/course/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 课程修改
export function courseEdit(data) {
  return request.put('/course/admin/course/edit', data)
}

// 课程保存
export function courseSave(data) {
  return request.post('/course/admin/course/save', data)
}

// 课程修改
export function courseDelete(data) {
  return request.delete('/course/admin/course/delete?id=' + data.id, data)
}

// 分页
export function userCoursePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/course/admin/user/course/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 分页
export function userStudyePage(params, pageCurrent = 1, pageSize = 20) {
  return request({url: '/course/admin/user/study/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}
