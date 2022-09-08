import request from '@/utils/request'

// 音视频上传参数
export function vodConfig() {
  return request.get('/course/admin/resource/vod/config')
}

export function saveResource(data) {
  return request.post('/course/admin/resource/save', data);
}

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
