import request from '@/utils/request'

// 点播数据
export function statVod() {
  return request({url: '/system/admin/stat/vod', method: 'get'})
}

// 登录数据
export function statLogin() {
  return request({url: '/user/admin/stat/login?dates=-14', method: 'get'})
}
