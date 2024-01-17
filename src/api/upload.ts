import {getRequest, postRequest, upload} from '@/utils/request'

export const uploadApi = {
    pic: (data: any, cb: any) => {
        return upload(data, cb, 'picFile')
    },
    doc: (data: any, cb: any) => {
        return upload(data, cb, 'docFile')
    },
    getVodConfig: () => {
        return getRequest('/course/admin/resource/vod/config')
    },
    saveResource: (data: any) => {
        return postRequest('/course/admin/resource/save', data);
    }
}

