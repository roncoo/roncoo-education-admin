import request from '@/utils/request'

// 获取站点信息接口
export const getWebsite = (params = {}) => {
  return request.get('/system/api/sys/config/website', params)
}

// 获取验证码
export function getCodeImg() {
  return request.get('/system/api/common/code')
}

// 登录接口
export function login(data) {
  return request({url: '/system/admin/login/password', method: 'post', data})
}

// 获取用户信息
export function getInfo() {
  return request.get('/system/admin/sys/user/current')
}

// 获取当前登录用户菜单
export function getUserMenu(data = {}) {
  return request({url: '/system/admin/sys/menu/user/list', method: 'post', data})
}

// 获取当前登录用户权限
export function getUserPermission() {
  return request.get('/system/admin/sys/menu/permission/list')
}
