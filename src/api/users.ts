import {deleteRequest, postRequest, putRequest} from '@/utils/request'

export const usersApi = {

// 订单分页
    orderInfoPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/order/info/page', {pageCurrent, pageSize, ...params})
    },


// 讲师分页
    lecturerPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/lecturer/page', {pageCurrent, pageSize, ...params})
    },

// 讲师修改
    lecturerEdit: (data: any) => {
        return putRequest('/user/admin/lecturer/edit', data)
    },

// 讲师保存
    lecturerSave: (data: any) => {
        return postRequest('/user/admin/lecturer/save', data)
    },

// 讲师删除
    lecturerDelete: (data: any) => {
        return deleteRequest('/user/admin/lecturer/delete?id=' + data.id)
    },

// 用户分页
    usersPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/users/page', {pageCurrent, pageSize, ...params})
    },

// 用户修改
    usersEdit: (data: any) => {
        return putRequest('/user/admin/users/edit', data)
    },

// 用户删除
    usersDelete: (data: any) => {
        return deleteRequest('/user/admin/users/delete?id=' + data.id)
    },

// 登录日志
    logLoginPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/log/login/page', {pageCurrent, pageSize, ...params})
    },

// 分页
    userCoursePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/user/course/page', {pageCurrent, pageSize, ...params})
    }

}