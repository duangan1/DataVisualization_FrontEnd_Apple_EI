import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getLang } from '@/utils/auth'

export const baseURL = process.env.VUE_APP_BASE_API
export const fileServerURL = process.env.VUE_APP_FILE_SERVER

// axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['Lang'] = getLang()
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          '您的会话已超时并登出, 您可以选择取消并停留在此页面或重新登录.',
          '会话超时',
          {
            confirmButtonText: '登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const res = error.response
    // const status = res.status // http code
    const resData = res.data // axios 包装的response body

    // const code = resData.code // 自定义的code
    const message = resData.message // 自定义的错误信息

    Message({
      message: message || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
