import {systemApi} from '@/api/system';
import {getSessionStorage, setSessionStorage} from '@/utils/storage';

/**
 * 格式化时长
 * @param mss
 */
export function formatTime(time: number) {
    let a: number | string = ~~(time / 3600);
    let b: number | string = ~~(time / 60) - a * 60;
    let c: number | string = time % 60;
    a = String(a).padStart(2, "0");
    b = String(b).padStart(2, "0");
    c = String(c).padStart(2, "0");
    if (a === '00') {
        return `${b}:${c}`;
    } else {
        return `${a}:${b}:${c}`;
    }
}

// 获取文件大小
export function formatSize(size: number) {
    if (!size)
        return "";
    var num = 1024.00
    if (size < num)
        return size + "B";
    if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + "K"; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}

/**
 * 获取枚举
 */
export function getEnum(enumName: string) {
    const enumAttr = getSessionStorage(enumName)
    if (enumAttr) {
        return enumAttr
    } else {
        systemApi.getEnum({enumName}).then((res: any) => {
            setSessionStorage(enumName, res)
            return res
        })
    }
}

/**
 * 获取枚举
 */
export function getEnumObj(enumName: string) {
    const enumAttr = getSessionStorage(enumName)
    if (enumAttr) {
        return toObj(enumAttr)
    } else {
        systemApi.getEnum({enumName}).then((res: any) => {
            setSessionStorage(enumName, res)
            return toObj(res)
        })
    }
}

function toObj(attr: any) {
    const obj: any = {}
    for (var i = 0; i < attr.length; i++) {
        obj[attr[i].code] = attr[i].desc
    }
    return obj
}
