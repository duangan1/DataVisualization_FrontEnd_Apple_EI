import request from '@/utils/request'
import QS from 'qs'

export const queryMessagesByPage = param => {
  const form = QS.stringify(param, { arrayFormat: 'repeat' })

  return request({
    url: `/message?${form}`,
    method: 'get'
  })
}

export const sendNotification = data =>
  request({
    url: `/message`,
    method: 'post',
    data
  })
