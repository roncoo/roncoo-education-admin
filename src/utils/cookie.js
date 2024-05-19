import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/utils/constants/system'

/**
 * 单位：天
 */
const TokenExpiresTime = 1

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token, {
    expires: TokenExpiresTime
  })
}

export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY, {
    expires: 0
  })
}
