import request from '@/utils/request'
import {string} from "fast-glob/out/utils";

// 订单分页
export function orderInfoPage(params: any, pageCurrent = 1, pageSize = 20) {
    return request({url: '/user/admin/order/info/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 订单修改
export function orderInfoEdit(data: any) {
    return request.put('/user/admin/order/info/edit', data)
}

// 讲师分页
export function lecturerPage(params: any, pageCurrent = 1, pageSize = 20) {
    return request({url: '/user/admin/lecturer/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 讲师修改
export function lecturerEdit(data: any) {
    return request.put('/user/admin/lecturer/edit', data)
}

// 讲师保存
export function lecturerSave(data: any) {
    return request.post('/user/admin/lecturer/save', data)
}

// 讲师删除
export function lecturerDelete(data = {id: string}) {
    return request.delete('/user/admin/lecturer/delete?id=' + data.id)
}

// 用户分页
export function usersPage(params: any, pageCurrent = 1, pageSize = 20) {
    return request({url: '/user/admin/users/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 用户修改
export function usersEdit(data: any) {
    return request.put('/user/admin/users/edit', data)
}

// 用户修改
export function usersDelete(data: any) {
    return request.delete('/user/admin/users/delete?id=' + data.id, data)
}

// 登录日志
export function logLoginPage(params: any, pageCurrent = 1, pageSize = 20) {
    return request({url: '/user/admin/log/login/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}

// 分页
export function userCoursePage(params: any, pageCurrent = 1, pageSize = 20) {
    return request({url: '/course/admin/user/course/page', method: 'post', data: {pageCurrent: pageCurrent, pageSize: pageSize, ...params}})
}
