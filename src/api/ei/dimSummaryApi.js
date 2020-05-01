import request from '@/utils/request'

export function searchHeader(params) {
  return request({
    url: '/ei/summary/header/list',
    method: 'get',
    params
  })
}

export function findHeaderById(id) {
  return request({
    url: `/ei/summary/header/${id}`,
    method: 'get'
  })
}

export function findDetailsByHeaderId(id) {
  return request({
    url: `/ei/summary/detail/${id}`,
    method: 'get'
  })
}

export function searchDetails(params) {
  return request({
    url: '/ei/summary/detail/list',
    method: 'get',
    params
  })
}

export function createSummary(cellHeaderId) {
  return request({
    url: `/ei/summary/create/${cellHeaderId}`,
    method: 'get'
  })
}

export function refreshData(id) {
  return request({
    url: `/ei/summary/header/refresh/${id}`,
    method: 'get'
  })
}

export function updateChkResult(params) {
  return request({
    url: `/ei/summary/detail/fai/update`,
    method: 'post',
    data: params
  })
}

export function calcData(id) {
  return request({
    url: `/ei/summary/header/calc/${id}`,
    method: 'get'
  })
}

