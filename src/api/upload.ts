import {getRequest, postRequest, upload} from '@/utils/request'

export const uploadApi = {
    pic: (data: any) => {
        return upload('/system/admin/upload/pic', data, 'picFile')
    },
    doc: (data: any) => {
        return upload('/system/admin/upload/doc', data, 'docFile')
    },
    getVodConfig: () => {
        return getRequest('/course/admin/resource/vod/config')
    },
    saveResource: (data: any) => {
        return postRequest('/course/admin/resource/save', data);
    }
}

