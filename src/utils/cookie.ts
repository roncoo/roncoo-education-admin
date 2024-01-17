import Cookies from 'js-cookie'

const TokenKey = 'EDU_OS_TOKEN'
/**
 * 单位：天
 */
const TokenExpiresTime = 1

export function setToken(token: string) {
    return Cookies.set(TokenKey, token, {
        expires: TokenExpiresTime
    })
}

export function getToken() {
    return Cookies.get(TokenKey)
}

export function removeToken() {
    return Cookies.remove(TokenKey, {
        expires: 0
    })
}
