import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/core/schedule',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/core/schedule',
    method: data.coreExpTemplateId ? 'put' : 'post',
    data
  })
}

export function deleteExpTemplate(id) {
  debugger
  return request({
    url: `/core/schedule/${id}`,
    method: 'delete'
  })
}
