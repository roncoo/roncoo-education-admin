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

// 文件大小转换
export function transformSize(bytes: string) {// 文件大小转换
    const bt = parseInt(bytes);
    let result;
    if (bt === 0) {
        result = '0B';
    } else {
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bt) / Math.log(k));
        if (typeof i !== 'number') {
            result = '-';
        } else {
            result = (bt / Math.pow(k, i)).toFixed(2) + sizes[i];
        }
    }
    return result;
}

/**
 * 获取枚举
 */
export function getEnumList(enumName: string) {
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

export function getEnumObj(enumName: string) {
    let enumList = getEnumList(enumName);
    if (!enumList) {
        enumList = getEnumList(enumName);
    }
    return toObj(enumList)
}

function toObj(attr: any) {
    const obj: any = {}
    if (attr) {
        for (var i = 0; i < attr.length; i++) {
            obj[attr[i].code] = attr[i].desc
        }
    }
    return obj
}
