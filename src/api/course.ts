import {deleteRequest, postRequest, putRequest} from '@/utils/request'

export const courseApi = {
    // 专区课程分页
    zoneCoursePage: (data: any) => {
        return postRequest('/course/admin/zone/course/page', data)
    },

// 专区课程修改
    zoneCourseEdit: (data: any) => {
        return putRequest('/course/admin/zone/course/edit', data)
    },

// 专区课程保存
    zoneCourseSave: (data: any) => {
        return postRequest('/course/admin/zone/course/save', data)
    },

// 专区课程修改
    zoneCourseDelete: (data: any) => {
        return deleteRequest('/course/admin/zone/course/delete?id=' + data.id)
    },

// 专区分页
    zonePage: (data: any) => {
        return postRequest('/course/admin/zone/page', data)
    },

// 专区修改
    zoneEdit: (data: any) => {
        return putRequest('/course/admin/zone/edit', data)
    },

// 专区保存
    zoneSave: (data: any) => {
        return postRequest('/course/admin/zone/save', data)
    },

// 专区修改
    zoneDelete: (data: any) => {
        return deleteRequest('/course/admin/zone/delete?id=' + data.id)
    },

// 分类列表
    categoryList: (data: any) => {
        return postRequest('/course/admin/category/list', data)
    },

// 分类修改
    categoryEdit: (data: any) => {
        return putRequest('/course/admin/category/edit', data)
    },

// 分类保存
    categorySave: (data: any) => {
        return postRequest('/course/admin/category/save', data)
    },

// 分类修改
    categoryDelete: (data: any) => {
        return deleteRequest('/course/admin/category/delete?id=' + data.id)
    },

// 资源分页
    resourcePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/resource/page', {pageCurrent, pageSize, ...params})
    },

// 资源修改
    resourceEdit: (data: any) => {
        return putRequest('/course/admin/resource/edit', data)
    },

// 资源保存
    resourceSave: (data: any) => {
        return postRequest('/course/admin/resource/save', data)
    },

// 资源修改
    resourceDelete: (data: any) => {
        return deleteRequest('/course/admin/resource/delete?id=' + data.id)
    },

// 课程章节分页
    courseChapterPeriodPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/course/chapter/period/page', {pageCurrent, pageSize, ...params})
    },

// 课程章节修改
    courseChapterPeriodEdit: (data: any) => {
        return putRequest('/course/admin/course/chapter/period/edit', data)
    },

// 课程章节保存
    courseChapterPeriodSave: (data: any) => {
        return postRequest('/course/admin/course/chapter/period/save', data)
    },

// 课程章节修改
    courseChapterPeriodDelete: (data: any) => {
        return deleteRequest('/course/admin/course/chapter/period/delete?id=' + data.id)
    },

// 课程章分页
    courseChapterPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/course/chapter/page', {pageCurrent, pageSize, ...params})
    },

// 课程章修改
    courseChapterEdit: (data: any) => {
        return putRequest('/course/admin/course/chapter/edit', data)
    },

// 课程章保存
    courseChapterSave: (data: any) => {
        return postRequest('/course/admin/course/chapter/save', data)
    },

// 课程章修改
    courseChapterDelete: (data: any) => {
        return deleteRequest('/course/admin/course/chapter/delete?id=' + data.id)
    },

// 课程分页
    coursePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/course/page', {pageCurrent, pageSize, ...params})
    },

// 课程修改
    courseEdit: (data: any) => {
        return putRequest('/course/admin/course/edit', data)
    },

// 课程保存
    courseSave: (data: any) => {
        return postRequest('/course/admin/course/save', data)
    },

// 课程修改
    courseDelete: (data: any) => {
        return deleteRequest('/course/admin/course/delete?id=' + data.id)
    },

// 分页
    userCourseRecord: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/user/course/record', {pageCurrent, pageSize, ...params})
    },

// 分页
    userStudyePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/user/study/page', {pageCurrent, pageSize, ...params})
    },

// 课程评论
    userCourseComment: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/user/course/comment/page', {pageCurrent, pageSize, ...params})
    },

// 课程评论删除
    courseCommentDelete: (data: any) => {
        return deleteRequest('/course/admin/user/course/comment/delete?id=' + data.id)
    },

// 课程收藏
    userCourseCollect: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/user/course/collect/page', {pageCurrent, pageSize, ...params})
    },

    /**
     * 素材信息预览
     * @param data
     * @returns {*},
     */
    resourceLibraryPreview: (data: any) => {
        return postRequest('/resource/admin/material/preview', data)
    }
}

