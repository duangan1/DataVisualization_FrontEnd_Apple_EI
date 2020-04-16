import request from '@/utils/request'

export function select(params) {
  return request({
    url: '/ei/project',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/ei/project',
    method: 'post',
    data
  })
}

export function remove(id) {
  return request({
    url: `/ei/project/${id}`,
    method: 'delete'
  })
}

export function upload(data) {
  return request({
    url: '/ei/project',
    method: 'put',
    data
  })
}
