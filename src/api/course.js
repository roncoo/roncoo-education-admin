import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request'

export const courseApi = {
  // 专区课程分页
  zoneCoursePage: (data) => {
    return postRequest('/course/admin/zone/course/page', data)
  },

  // 专区课程修改
  zoneCourseEdit: (data) => {
    return putRequest('/course/admin/zone/course/edit', data)
  },

  // 专区课程保存
  zoneCourseSave: (data) => {
    return postRequest('/course/admin/zone/course/save', data)
  },

  // 专区课程修改
  zoneCourseDelete: (data) => {
    return deleteRequest('/course/admin/zone/course/delete?id=' + data.id)
  },

  // 专区分页
  zonePage: (data) => {
    return postRequest('/course/admin/zone/page', data)
  },

  // 专区修改
  zoneEdit: (data) => {
    return putRequest('/course/admin/zone/edit', data)
  },

  // 专区保存
  zoneSave: (data) => {
    return postRequest('/course/admin/zone/save', data)
  },

  // 专区修改
  zoneDelete: (data) => {
    return deleteRequest('/course/admin/zone/delete?id=' + data.id)
  },

  // 分类列表
  categoryList: (data) => {
    return postRequest('/course/admin/category/list', data)
  },

  // 分类修改
  categoryEdit: (data) => {
    return putRequest('/course/admin/category/edit', data)
  },

  // 分类保存
  categorySave: (data) => {
    return postRequest('/course/admin/category/save', data)
  },

  // 分类修改
  categoryDelete: (data) => {
    return deleteRequest('/course/admin/category/delete?id=' + data.id)
  },

  // 分类排序
  categorySort: (data) => {
    return putRequest('/course/admin/category/sort', data)
  },

  // 资源分页
  resourcePage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/resource/page', { pageCurrent, pageSize, ...params })
  },

  // 资源修改
  resourceEdit: (data) => {
    return putRequest('/course/admin/resource/edit', data)
  },

  // 资源保存
  resourceSave: (data) => {
    return postRequest('/course/admin/resource/save', data)
  },

  // 资源删除
  resourceDelete: (data) => {
    return deleteRequest('/course/admin/resource/delete?id=' + data.id)
  },

  // 资源批量删除
  resourceBatchDelete: (data) => {
    return putRequest('/course/admin/resource/batch/delete', data)
  },

  // 课程章节分页
  courseChapterPeriodPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/course/chapter/period/page', {
      pageCurrent,
      pageSize,
      ...params
    })
  },

  // 课程章节修改
  courseChapterPeriodEdit: (data) => {
    return putRequest('/course/admin/course/chapter/period/edit', data)
  },

  // 课程章节保存
  courseChapterPeriodSave: (data) => {
    return postRequest('/course/admin/course/chapter/period/save', data)
  },

  // 课程章节修改
  courseChapterPeriodDelete: (data) => {
    return deleteRequest('/course/admin/course/chapter/period/delete?id=' + data.id)
  },

  // 课程章分页
  courseChapterPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/course/chapter/page', { pageCurrent, pageSize, ...params })
  },

  // 课程章修改
  courseChapterEdit: (data) => {
    return putRequest('/course/admin/course/chapter/edit', data)
  },

  // 课程章保存
  courseChapterSave: (data) => {
    return postRequest('/course/admin/course/chapter/save', data)
  },

  // 课程章修改
  courseChapterDelete: (data) => {
    return deleteRequest('/course/admin/course/chapter/delete?id=' + data.id)
  },

  // 课程分页
  coursePage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/course/page', { pageCurrent, pageSize, ...params })
  },

  // 课程修改
  courseView: (data) => {
    return getRequest('/course/admin/course/view?id=' + data.id)
  },
  // 课程修改
  courseEdit: (data) => {
    return putRequest('/course/admin/course/edit', data)
  },

  // 课程保存
  courseSave: (data) => {
    return postRequest('/course/admin/course/save', data)
  },

  // 课程修改
  courseDelete: (data) => {
    return deleteRequest('/course/admin/course/delete?id=' + data.id)
  },

  // 分页
  userCourseRecord: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/user/course/record', { pageCurrent, pageSize, ...params })
  },

  // 分页
  userStudyPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/user/study/page', { pageCurrent, pageSize, ...params })
  },

  // 课程评论
  userCourseComment: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/user/course/comment/page', {
      pageCurrent,
      pageSize,
      ...params
    })
  },

  // 课程评论删除
  courseCommentDelete: (data) => {
    return deleteRequest('/course/admin/user/course/comment/delete?id=' + data.id)
  },

  // 课程收藏
  userCourseCollect: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/user/course/collect/page', {
      pageCurrent,
      pageSize,
      ...params
    })
  },

  /**
   * 素材信息预览
   */
  resourceLibraryPreview: (data) => {
    return getRequest('/course/admin/resource/preview?id=' + data.id)
  }
}
