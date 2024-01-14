import request, {getRequest, postRequest} from '@/utils/request'

export const uploadApi = {
  pic: (data, cb) => {
    return upload('/system/admin/upload/pic', cb, 'picFile')
  },
  doc: (data, cb) => {
    return upload('/system/admin/upload/doc', cb, 'docFile')
  },
  getVodConfig: () => {
    return getRequest('/course/admin/resource/vod/config')
  },
  saveResource: (data) => {
    return postRequest('/course/admin/resource/save', data);
  }
}

function upload(data, cb, fileName) {
  const formData = new FormData()
  formData.append(fileName, data.file)
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
