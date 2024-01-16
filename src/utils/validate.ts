/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/** 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
export function isMoney(number) {
  return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(number)
}
/**
  *邮箱
* */
export function isEmail(email) {
  return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
}

export function isCardNo(no) {
  return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(no) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/.test(no)
}
 // 正则 英文+数字
export function isLoginName(no) {
  return /[A-Za-z0-9.,!~@#$%&*^><|]+/gi.test(no)
}

export function isPhoneNo(no) {
  return /^1[3456789]\d{9}$/.test(no)
}
/** 2-20个字符，以大小写字母或中文开头，可包含数字、“.”、“_”、“:”或“-”*/
export function ecsName(name) {
  return /^[A-Za-z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_.:-]{1,19}$/.test(name)
}
/** 2-128个字符，以字母或中文开头，可包含数字，"_"或"-"*/
export function networkName(name) {
  return /^[A-Za-z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_-]{1,127}$/.test(name)
}
/** 检测密码强度，
 * 1：弱-纯数字，纯字母，纯特殊字符
 * 2：中-字母+数字，字母+特殊字符，数字+特殊字符
 * 3：强-字母+数字+特殊字符
 */
export function checkPWD(no) {
  if (/^(?![a-zA-z]+$)(?!\d+$)(?![!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)(?![a-zA-z\d]+$)(?![a-zA-z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)(?![\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(no)) {
    return 3
  } else
  if (/^(?![a-zA-z]+$)(?!\d+$)(?![!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(no)) {
    return 2
  } else
  if (/^(?:\d+|[a-zA-Z]+|[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+)$/.test(no)) {
    return 1
  } else {
    return 0
  }
}

export function validPWd (no) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(no)
}
