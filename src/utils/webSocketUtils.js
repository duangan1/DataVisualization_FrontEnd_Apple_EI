let socket = {}
export const baseURL = process.env.VUE_APP_BASE_API
const callback = {}
export function openSocket(userId) {
  if (typeof (WebSocket) === 'undefined') {
    console.log('您的浏览器不支持WebSocket')
  } else {
    // console.log('您的浏览器支持WebSocket')

    var socketUrl = document.location.origin + baseURL + '/imserver/' + userId

    if (document.location.origin.startsWith('http://localhost')) { socketUrl = 'http://127.0.0.1/api/imserver/' + userId }
    socketUrl = socketUrl.replace('https', 'wss').replace('http', 'ws')
    // console.log(socketUrl)

    socket = new WebSocket(socketUrl)

    // 打开事件
    socket.onopen = function() {
      // console.log('websocket已打开')
    }
    // 获得消息事件
    socket.onmessage = function(msg) {
      // console.log(msg.data)
      const message = JSON.parse(msg.data)
      if (callback[message.type]) {
        callback[message.type](message)
      }
      // 发现消息进入    开始处理前端触发逻辑
    }
    // 关闭事件
    socket.onclose = function() {
      // console.log('websocket已关闭')

      setTimeout(
        () => {
          openSocket(userId)
        }, 1000)
    }
    // 发生了错误事件
    socket.onerror = function() {
      // console.log('websocket发生了错误')
    }
  }
}
export function notify(type, cb) {
  callback[type] = cb
}
export function sendMessage() {
  if (typeof (WebSocket) === 'undefined') {
    console.log('您的浏览器不支持WebSocket')
  } else {
    socket.send('')
  }
}
