import request from '@/utils/request'

export function select(params) {
  return request({
    url: '/ei/cellQualData',
    method: 'get',
    params
  })
}

export function generateJMP(headerId) {
  return request({
    url: `/ei/cellQualData/generateJMP/${headerId}`,
    method: 'get'

  })
}

