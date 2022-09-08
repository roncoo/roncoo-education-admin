import request from '@/utils/request'

// 点播数据
export function statVod() {
  return request({url: '/system/admin/stat/vod', method: 'post'})
}
