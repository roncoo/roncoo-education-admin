/**
 * 存储localStorage
 */
export function setStore(name: string, content: string) {
    if (!name) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export function getStore(name: string) {
    if (!name) return
    return window.localStorage.getItem(name)
}

/**
 *
 * @param name
 * @param content
 * @param expireTime 单位：分
 */
export function setSessionStorage(name: string, content: string, expireTime?: number | null) {
    if (!name) return
    let params = JSON.stringify(content)
    if (expireTime) {
        expireTime = Date.now() + expireTime * 1000 * 60
        params = JSON.stringify({content: content, expireTime: expireTime})
    }
    window.sessionStorage.setItem(name, params)
}

/**
 * 获取sessionStorage
 */
export function getSessionStorage(name: string) {
    if (!name) return

    let data: any = window.sessionStorage.getItem(name)
    if (!data) return null

    data = JSON.parse(data)
    if (data) {
        if (data.expireTime && data.expireTime > 0) {
            if (data.expireTime > Date.now()) {
                return data.content
            }
            window.sessionStorage.removeItem(name)
            return null
        }
        return data
    }
    return null
}


