import moment from 'moment'

export function noChangeFormat(row, column) {
  return row[column.property]
}
// DateTime
export function tableDateTimeFormat(row, column) {
  const cellValue = row[column.property]
  return cellValueDateTimeFormat(cellValue)
}

export const cellValueDateTimeFormat = (cellValue) =>
  dateTimeFormat(cellValue)

export const dateTimeFormat = (date, format) =>
  date ? moment(date).format(format || 'YYYY-MM-DD HH:mm:ss') : ''

// Date
export function tableDateFormat(row, column) {
  const cellValue = row[column.property]
  return cellValueDateFormat(cellValue)
}

export const cellValueDateFormat = (cellValue) =>
  dateFormat(cellValue)

export const dateFormat = (date, format) =>
  date ? moment(date).format(format || 'YYYY-MM-DD') : ''

export const fileTypeFormat = (row) => {
  const array = row['name'].split('.')
  return array[array.length - 1].toUpperCase()
}

export const getNow = () =>
  moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}',
  )
}
export function tableNumFormat(row, column) {
  const cellValue = row[column.property]
  return numFormat(cellValue)
}
export function numFormat(value) {
  if (!value) return value

  /* 原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
  var sign = Math.sign(value)
  var intPart = Number(value) | 0 // 获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

  var floatPart = '.00' // 预定义小数部分
  var value2Array = ('' + value).split('.')

  // =2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString() // 拿到小数部分
    if (floatPart.length > 2) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart.substring(0, 2)
    } else
    if (floatPart.length === 1) { // 补0,实际上用不着
      return (intPartFormat === '0' ? (sign === -1 ? '-' : '') : '') + (intPartFormat + '.' + floatPart + '0')
    } else {
      return (intPartFormat === '0' ? (sign === -1 ? '-' : '') : '') + (intPartFormat + '.' + floatPart)
    }
  } else {
    return (intPartFormat === '0' ? (sign === -1 ? '-' : '') : '') + (intPartFormat + floatPart)
  }
}

export function formatJsDateTime2Zformat(date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  var second = date.getSeconds()
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + 'T' + h + ':' + minute + ':' + second
}

export function formatJsDate2Zformat(date) {
  if (!(date instanceof Date)) {
    return date
  }
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = '00'
  var minute = '00'
  var second = '00'
  return y + '-' + m + '-' + d + 'T' + h + ':' + minute + ':' + second
}
