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
 * 存储sessionStorage
 */
export function setSessionStorage(name: string, content: string) {
    if (!name) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export function getSessionStorage(name: string) {
    if (!name) return
    const data = window.sessionStorage.getItem(name)
    if (data) {
        return JSON.parse(data)
    }
    return null
}


