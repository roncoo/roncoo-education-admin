import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/base/boss/sys/user/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: '/base/boss/sys/user/current/view',
        method: 'get'
    })
}
