import request, {putRequest} from '@/utils/request'

export const usersApi = {

// 订单分页
    orderInfoPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/order/info/page', data)
    },

// 订单修改
    orderInfoEdit: (data: any) => {
        return putRequest('/user/admin/order/info/edit', data)
    },

// 讲师分页
    lecturerPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/lecturer/page', data)
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
        return request.delete('/user/admin/lecturer/delete?id=' + data.id)
    },

// 用户分页
    usersPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/user/admin/users/page', data)
    },

// 用户修改
    usersEdit: (data: any) => {
        return putRequest('/user/admin/users/edit', data)
    },

// 用户修改
    usersDelete: (data: any) => {
        return request.delete('/user/admin/users/delete?id=' + data.id, data)
    },

// 登录日志
    logLoginPage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return request('/user/admin/log/login/page', data)
    },

// 分页
    userCoursePage: (params: any, pageCurrent: 1, pageSize: 20) => {
        return postRequest('/course/admin/user/course/page', data)
    }

}