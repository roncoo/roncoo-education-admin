import { getRequest, postRequest, upload } from '@/utils/request'

export const uploadApi = {
  pic: (file) => {
    return upload('/system/admin/upload/pic?name=' + file.name, file, 'picFile')
  },
  doc: (file, cb, cancelFun) => {
    return upload('/system/admin/upload/doc?name=' + file.name, file, 'docFile', cb, cancelFun)
  },
  app: (file, cb, cancelFun) => {
    return upload('/system/admin/upload/app?name=' + file.name, file, 'appFile', cb, cancelFun)
  },
  getVodConfig: () => {
    return getRequest('/course/admin/resource/vod/config?t' + Date.now())
  },
  saveResource: (data) => {
    return postRequest('/course/admin/resource/save?t=' + Date.now(), data)
  }
}
