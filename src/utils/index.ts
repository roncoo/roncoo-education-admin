/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time: any, cFormat: any) {
    // if (arguments.length === 0) {
    //     return null
    // }
    // const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    // let date
    // if (typeof time === 'object') {
    //     date = time
    // } else {
    //     if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
    //         time = parseInt(time)
    //     }
    //     if ((typeof time === 'number') && (time.toString().length === 10)) {
    //         time = time * 1000
    //     }
    //     date = new Date(time)
    // }
    // const formatObj = ()=>{
    //     y: date.getFullYear(),
    //     m: date.getMonth() + 1,
    //     d: date.getDate(),
    //     h: date.getHours(),
    //     i: date.getMinutes(),
    //     s: date.getSeconds(),
    //     a: date.getDay()
    // }
    // const time_str = format.replace(/{([ymdhisa])+}/g, (key: any) => {
    //     const value = formatObj[key]
    //     // Note: getDay() returns 0 on Sunday
    //     if (key === 'a') {
    //         return ['日', '一', '二', '三', '四', '五', '六'][value]
    //     }
    //     return value.toString().padStart(2, '0')
    // })
    let time_str = time + cFormat
    return time_str
}
