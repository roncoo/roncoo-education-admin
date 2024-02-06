import {getRequest, postRequest, upload} from '@/utils/request'

export const uploadApi = {
    pic: (file: any) => {
        return upload('/system/admin/upload/pic?name=' + file.name, file, 'picFile')
    },
    doc: (file: any, cb: any, cancelFun: any) => {
        return upload('/system/admin/upload/doc?name=' + file.name, file, 'docFile', cb, cancelFun)
    },
    getVodConfig: () => {
        return getRequest('/course/admin/resource/vod/config?t' + Date.now())
    },
    saveResource: (data: any) => {
        return postRequest('/course/admin/resource/save?t=' + Date.now(), data);
    }
}

