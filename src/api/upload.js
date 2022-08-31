import request from '@/utils/request'

export function uploadPic(data, cb, params = {}) {
  // 上传方法
  const formData = new FormData()
  formData.append('picFile', data.file)
  const config = {
    onUploadProgress: progressEvent => {
      const videoUploadPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
      // 计算上传进度
      if (cb) {
        cb(videoUploadPercent)
      }
    }
  }
  return request.post(`/system/admin/upload/pic`, formData, config)
}

export function uploadDoc(data, cb) {
  const formData = new FormData()
  formData.append('docFile', data.file)
  const config = {
    onUploadProgress: progressEvent => {
      const videoUploadPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
      // 计算上传进度
      if (cb) {
        cb(videoUploadPercent)
      }
    }
  }
  return request.post('/system/admin/upload/doc', formData, config)
}
