import request from '@/utils/request'

// 获取枚举
export function enumList(enumName) {
  return request.get(`/v1/admin/enum/list/${enumName}`)
}
import { getToken } from '@/utils/auth'

import * as axios from 'axios'

const createUpload = (url, params = {}, cb) => {
  const cancelToken = axios.CancelToken
  const source = cancelToken.source()
  const config = {
    onUploadProgress: (progressEvent) => {
      const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      if (cb) {
        cb(complete, source)
      }
    },
    headers: {
      'Content-Type': 'multipart/form-data',
      token: getToken()
    },
    cancelToken: source.token,
    timeout: 1000 * 60 * 90
  }
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_BASE_API + url + '?token=' + getToken(), params, config).then((res) => {
      resolve(res.data)
    }).catch((error) => {
      if (axios.isCancel(error)) { // 主要是这里
        console.log('取消成功')
      }
      reject(error)
    })
  })
}

// 上传图片
export const uploadPic = (params = {}, cb) => {
  return createUpload('/v1/common/upload/pic', params, cb)
}

