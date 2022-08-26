import request from '@/utils/request'
import * as axios from 'axios'
import {getToken} from '@/utils/auth'

// 分类--添加
export function configSave(data = {}) {
  return request.post('/v1/admin/config/save', data)
}

// 分类--查看
export function configView(id) {
  return request.get(`/v1/admin/config/view?id=${id}`)
}

// 分类--删除
export function configDelete(id) {
  return request.delete(`/v1/admin/config/delete?id=${id}`);
}

// 分类--编辑
export function configEdit(data = {}) {
  return request.put('/v1/admin/config/edit', data)
}

// 分类管理--分页
export function configList(params) {
  return request.post('/v1/admin/config/list', {...params})
}

// 获取枚举
export function enumList(enumName) {
  return request.get(`/v1/admin/enum/list/${enumName}`)
}

// 上传图片
export const uploadPic = (params = {}, cb) => {
  return createUpload('/v1/common/upload/pic', params, cb)
}

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
