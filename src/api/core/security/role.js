import request from '@/utils/request'

export function listRole(params) {
  return request({
    url: '/core/security/role',
    method: 'get',
    params
  })
}
export function listAllRole(params) {
  return request({
    url: '/core/security/role/all',
    method: 'get',
    params
  })
}
export function saveRole(data) {
  return request({
    url: '/core/security/role',
    method: data.roleId ? 'put' : 'post',
    data
  })
}

export function deleteRole(id) {
  debugger
  return request({
    url: `/core/security/role/${id}`,
    method: 'delete'
  })
}
export function getRoleAssign(id) {
  return request({
    url: `/core/security/role/assign/${id}`,
    method: 'get'
  })
}
export function saveRoleAssign(id, data) {
  return request({
    url: `/core/security/role/assign/${id}`,
    method: 'post',
    data
  })
}
