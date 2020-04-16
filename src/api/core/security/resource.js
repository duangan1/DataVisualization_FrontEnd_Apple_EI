import request from '@/utils/request'

export function resourceList(params) {
  return request({
    url: '/core/security/resource',
    method: 'get',
    params
  })
}

export function apiList(params) {
  return request({
    url: '/core/security/resource/api',
    method: 'get',
    params
  })
}

export function menuButtonSave(data) {
  return request({
    url: '/core/security/resource/menuButton',
    method: 'post',
    data
  })
}
export function resourceDelete(type, id) {
  return request({
    url: `/core/security/resource/${type}/${id}`,
    method: 'delete'
  })
}

export function menuSave(data) {
  return request({
    url: '/core/security/resource/menu',
    method: 'post',
    data
  })
}
export function menuDelete(id) {
  return request({
    url: `/core/security/resource/menu/${id}`,
    method: 'delete'
  })
}
