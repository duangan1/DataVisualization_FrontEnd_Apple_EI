import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/core/expTemplate',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/core/expTemplate',
    method: data.coreExpTemplateId ? 'put' : 'post',
    data
  })
}

export function deleteExpTemplate(id) {
  debugger
  return request({
    url: `/core/expTemplate/${id}`,
    method: 'delete'
  })
}
