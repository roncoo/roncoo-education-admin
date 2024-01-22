/**
 * 校验工具类
 */

/**
 *
 * @param path
 */
export function isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 合法uri
 * @param val
 */
export function validateURL(val: string) {
    const regexUrl = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return regexUrl.test(val)
}

/**
 * 邮箱
 * @param email
 */
export function isEmail(email: string) {
    return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
}

/**
 * 检测密码强度，
 * 1：弱-纯数字，纯字母，纯特殊字符
 * 2：中-字母+数字，字母+特殊字符，数字+特殊字符
 * 3：强-字母+数字+特殊字符
 */
export function checkPwd(no: string) {
    if (/^(?![a-zA-z]+$)(?!\d+$)(?![!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)(?![a-zA-z\d]+$)(?![a-zA-z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)(?![\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(no)) {
        return 3
    } else if (/^(?![a-zA-z]+$)(?!\d+$)(?![!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(no)) {
        return 2
    } else if (/^(?:\d+|[a-zA-Z]+|[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+)$/.test(no)) {
        return 1
    } else {
        return 0
    }
}
