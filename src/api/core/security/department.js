import request from '@/utils/request'

export const findAll = () => {
  return request({
    url: '/core/security/department/list',
    method: 'get'
  })
}
export const findAllDataOnly = () => {
  return request({
    url: '/core/security/department/listDataOnly',
    method: 'get'
  })
}
export const findByUserId = (userId) => {
  return request({
    url: `/core/security/department/list/${userId}`,
    method: 'get'
  })
}

export const save = (data) => {
  return request({
    url: '/core/security/department',
    method: 'post',
    data
  })
}

export const deleteById = (id) => {
  return request({
    url: `/core/security/department/${id}`,
    method: 'delete'
  })
}

export const findByName = (id, name) => {
  const params = { id: id, name: name }
  return request({
    url: `/core/security/department/name`,
    method: 'get',
    params
  })
}

export const findByCode = (code) => {
  const params = { code: code }
  return request({
    url: `/core/security/department/code`,
    method: 'get',
    params
  })
}

export const findCandidateUsers = (params) => {
  return request({
    url: `/core/security/department/users`,
    method: 'get',
    params
  })
}

export const assignUsersToDepartment = (departmentId, ids) => {
  return request({
    url: `/core/security/department/${departmentId}/users/${ids}`,
    method: 'post'
  })
}

export const findById = (id) => {
  return request({
    url: `/core/security/department/${id}`,
    method: 'get'
  })
}
