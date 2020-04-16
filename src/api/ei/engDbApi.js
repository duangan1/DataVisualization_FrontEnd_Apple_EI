import request from '@/utils/request'

export function searchPpHeader(params) {
  return request({
    url: '/ei/engDbPp/header/list',
    method: 'get',
    params
  })
}

export function deleteById(id) {
  return request({
    url: `/ei/engDbPp/header/${id}`,
    method: 'delete'
  })
}
