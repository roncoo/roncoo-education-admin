import request from '@/utils/request'

export function login(data) {
  return request.post('/v1/admin/login/password', data)
}
