import {systemApi} from '@/api/system';
import {getSessionStorage, setSessionStorage} from '@/utils/storage';

/**
 * 格式化时长
 * @param mss
 */
export function formatDuring(mss: number) {
    const hours = (mss % 86400000) / 3600000
    const minutes = (mss % 3600000) / 60000
    const seconds = (mss % 60000) / 1000
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
}

// 获取文件大小
export function getSize(limit: number) {
    let sizeStr = '';
    if (limit && limit !== 0) {
        if (limit < 102.4) { // 小于0.1KB，则转化成B
            sizeStr = limit.toFixed(2) + 'B'
        } else if (limit < 104857.6) { // 小于0.1MB，则转化成KB
            sizeStr = (limit / 1024).toFixed(2) + 'KB'
        } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
            sizeStr = (limit / (1024 * 1024)).toFixed(2) + 'MB'
        } else if (limit < 107374182.4) { // 小于0.1TB，则转化成GB
            sizeStr = (limit / 1073741824).toFixed(2) + 'GB'
        } else { // 其他转化成GB
            sizeStr = (limit / 1099511627776).toFixed(2) + 'TB'
        }
    }
    const index = sizeStr.indexOf('.'); // 获取小数点处的索引
    const dou = sizeStr.substring(index + 1, index + 3) // 获取小数点后两位的值
    if (dou === '00') {
        // 判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index)
    }
    return sizeStr;
}

/**
 * 获取枚举
 * @param enumName，枚举名称，大写开头
 * @param type，attr:属性；obj:实体
 */
export async function getEnum(enumName: string, type = 'attr') {
    const enumAttr = getSessionStorage(enumName)
    if (enumAttr) {
        if (type === 'obj') {
            return toObj(enumAttr)
        }
        return enumAttr
    } else {
        const res: any = await systemApi.getEnum({enumName});
        setSessionStorage(enumName, res)
        if (type === 'obj') {
            return toObj(res)
        }
        return res
    }
}

function toObj(attr: any) {
    const obj: any = {}
    for (var i = 0; i < attr.length; i++) {
        obj[attr[i].code] = attr[i].desc
    }
    return obj
}
