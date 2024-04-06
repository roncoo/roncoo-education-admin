import { getRequest } from '@/utils/request'

export const statApi = {
  // 数据统计
  data: () => {
    return getRequest('/user/admin/stat/data')
  },
  // 用户注册登录统计
  login: () => {
    return getRequest('/user/admin/stat/login?dates=-14')
  },
  // 点播用量统计
  vod: () => {
    return getRequest('/system/admin/stat/vod')
  }
}
