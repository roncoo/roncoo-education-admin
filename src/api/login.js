import request from '@/utils/request'

export function login(data) {
  return request.post('/system/admin/login/password', data)
}
