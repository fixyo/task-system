// 获取字符长度，中文算两个
/**
 * @param {String} v 需要计算长度的字符串
 * @param {Number} t {推广组}算几个字
 */
export const getCharLength = function (v, t) {
  if (t) {
    let s = ''
    for (let j = 0; j < t; j++) {
      s += 'a'
    }
    v = v.replace(/\{推广组\}/g, s)
  }
  let l = 0
  for (let i = 0; i < v.length; i++) {
    let a = v.charAt(i)
    // 如果是中文，算两个
    if (a.match(/[^\x00-\xff]/gi) != null) {
      l += 2
    } else {
      l += 1
    }
  }
  return l
}

/**
 *
 * @param {String} v 根据换行符获取
 */
export const getRowLength = function (v) {
  return v.split('\n').length
}
