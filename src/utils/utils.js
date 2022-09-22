/**
 * 阿拉伯数字转中文数字,
 * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
 * 传入数字字符串则没有限制
 * @param {number|string} digit
 */
export const toZhDigit = (digit) => {
  digit = typeof digit === 'number' ? String(digit) : digit;
  const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = ['千', '百', '十', ''];
  const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

  let breakLen = Math.ceil(digit.length / 4);
  let notBreakSegment = digit.length % 4 || 4;
  let segment;
  const zeroFlag = [];
  const allZeroFlag = [];
  let result = '';

  while (breakLen > 0) {
    if (!result) { // 第一次执行
      segment = digit.slice(0, notBreakSegment);
      const segmentLen = segment.length;
      for (let i = 0; i < segmentLen; i++) {
        if (segment[i] !== 0) {
          if (zeroFlag.length > 0) {
            result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
            // 判断是否需要加上 quot 单位
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
            zeroFlag.length = 0;
          } else {
            result += zh[segment[i]] + unit[4 - segmentLen + i];
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
          }
        } else {
          // 处理为 0 的情形
          if (segmentLen === 1) {
            result += zh[segment[i]];
            break;
          }
          zeroFlag.push(segment[i]);
          continue;
        }
      }
    } else {
      segment = digit.slice(notBreakSegment, notBreakSegment + 4);
      notBreakSegment += 4;

      for (let j = 0; j < segment.length; j++) {
        if (segment[j] !== 0) {
          if (zeroFlag.length > 0) {
            // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
            if (j === 0) {
              result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
            } else {
              result += '零' + zh[segment[j]] + unit[j];
            }
            zeroFlag.length = 0;
          } else {
            result += zh[segment[j]] + unit[j];
          }
          // 判断是否需要加上 quot 单位
          if (j === segment.length - 1 && breakLen > 1) {
            result += quot[breakLen - 2];
          }
        } else {
          // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
          if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
            result += quot[breakLen - 1];
            zeroFlag.length = 0;
            zeroFlag.push(segment[j]);
          } else if (allZeroFlag.length > 0) {
            // 执行到最后
            if (breakLen === 1) {
              result += '';
            } else {
              zeroFlag.length = 0;
            }
          } else {
            zeroFlag.push(segment[j]);
          }

          if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
            // 如果执行到末尾
            if (breakLen === 1) {
              allZeroFlag.length = 0;
              zeroFlag.length = 0;
              result += quot[breakLen - 1];
            } else {
              allZeroFlag.push(segment[j]);
            }
          }
          continue;
        }
      }

      --breakLen;
    }

    return result;
  }
}

/**
 * 格式化时长
 * @param mss
 * @returns {string}
 */
export const formatDuring = (mss) => {
  // const days = parseInt(mss / (1000 * 60 * 60 * 24));
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = parseInt((mss % (1000 * 60)) / 1000)
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
}

// 获取文件大小
export function getSize(limit) {
  let size = '';

  if (limit && limit !== 0) {
    if (limit < 0.1 * 1024) { // 小于0.1KB，则转化成B
      size = limit.toFixed(2) + 'B'
    } else if (limit < 0.1 * 1024 * 1024) { // 小于0.1MB，则转化成KB
      size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024 * 1024) { // 小于0.1TB，则转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    } else { // 其他转化成GB
      size = (limit / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'TB'
    }
  }

  const sizeStr = size + ''; // 转成字符串
  const index = sizeStr.indexOf('.'); // 获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou === '00') { // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size;
}

/**
 * 深拷贝
 * @param param
 * @returns {any}
 */
export function deepCopy(param) {
  return JSON.parse(JSON.stringify(param))
}
