import {getRequest, postRequest} from '../utils/request'

export const loginApi = {
    getWebsite: () => {
        return getRequest('/system/api/sys/config/website')
    },
    getCodeImg: () => {
        return getRequest('/system/api/common/code')
    },
    login: (data) => {
        return postRequest('/system/admin/login/password', data)
    },
    getUserInfo: () => {
        return getRequest('/system/admin/sys/user/current')
    },
    getUserMenu: (data) => {
        return postRequest('/system/admin/sys/menu/user/list', data)
    },
    getUserPermission: () => {
        return getRequest('/system/admin/sys/menu/permission/list')
    }
}
