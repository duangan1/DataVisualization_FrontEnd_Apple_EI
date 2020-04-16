import request from '@/utils/request'

export function allCountryLabel() {
  return request({
    url: '/core/location/allCountryLabel',
    method: 'get'
  })
}

export function findChildrenLabelById(id) {
  return request({
    url: `/core/location/childrenLabel/${id}`,
    method: 'get'
  })
}
