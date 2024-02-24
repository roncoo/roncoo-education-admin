import { systemApi } from '@/api/system.js'
import { getSessionStorage, setSessionStorage } from '@/utils/storage.js'
import { nextTick } from 'vue'

/**
 * 格式化时长
 * @param time
 */
export function formatTime(time) {
  let a = ~~(time / 3600)
  let b = ~~(time / 60) - a * 60
  let c = time % 60
  a = String(a).padStart(2, '0')
  b = String(b).padStart(2, '0')
  c = String(c).padStart(2, '0')
  if (a === '00') {
    return `${b}:${c}`
  } else {
    return `${a}:${b}:${c}`
  }
}

// 文件大小转换
export function transformSize(bytes) {
  // 文件大小转换
  const bt = parseInt(bytes)
  let result
  if (bt === 0) {
    result = '0B'
  } else {
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bt) / Math.log(k))
    if (typeof i !== 'number') {
      result = '-'
    } else {
      result = (bt / Math.pow(k, i)).toFixed(2) + sizes[i]
    }
  }
  return result
}

/**
 * 获取枚举
 */
export function getEnumList(enumName) {
  const enumAttr = getSessionStorage(enumName)
  if (enumAttr === null || enumAttr === undefined) {
    systemApi.getEnum({ enumName }).then((res) => {
      setSessionStorage(enumName, res)
      return getSessionStorage(enumName)
    })
  } else {
    return enumAttr
  }
}

export function getEnumObj(enumName) {
  let enumList = getEnumList(enumName)
  return toObj(enumList)
}

function toObj(attr) {
  const obj = {}
  if (attr) {
    for (let i = 0; i < attr.length; i++) {
      obj[attr[i].code] = attr[i].desc
    }
  }
  return obj
}
