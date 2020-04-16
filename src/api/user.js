import request from '@/utils/request'
const allUser = {}
export function login(data) {
  return request({
    url: '/core/security/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/core/security/user/info',
    method: 'post' // ,
    //  params: { token }
  })
}

export function logout() {
  try {
    request({
      url: '/core/security/user/logout',
      method: 'post'
    }).then(() => {})
  } catch (e) {
    console.log(e)
  }
  return new Promise((resolve, reject) => {
    resolve()
  })
}
export function userList(params) {
  return request({
    url: '/core/security/user',
    method: 'get',
    params
  })
}
export function getUser(id) {
  return request({
    url: `/core/security/user/${id}`,
    method: 'get'
  })
}
export function getUserProfile(id) {
  return request({
    url: `/core/security/user/${id}/profile`,
    method: 'get'
  })
}

export function updateUserProfile(data) {
  return request({
    url: `/core/security/user/${data.userId}/profile`,
    method: 'put',
    data
  })
}
export function updateUserPassword(data) {
  return request({
    url: `/core/security/user/${data.userId}/updatePassword`,
    method: 'put',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: `/core/security/user/${id}`,
    method: 'delete'
  })
}

export function saveUser(data) {
  return request({
    url: '/core/security/user',
    method: data.userId ? 'put' : 'post',
    data
  })
}

export function getUserAssign(id) {
  return request({
    url: `/core/security/user/assign/${id}`,
    method: 'get'
  })
}
export function saveUserAssign(id, data) {
  return request({
    url: `/core/security/user/assign/${id}`,
    method: 'post',
    data
  })
}
export function getUserTransfers() {
  return request({
    url: `/core/security/user/transfers`,
    method: 'get'
  })
}

export function criteria(params) {
  return request({
    url: `/core/security/user/criteria`,
    method: 'get',
    params
  })
}

export function queryUser(queryOption, query) {
  if (query !== '') {
    queryOption.loading = true

    criteria({ filter: "t.fullName start '" + query + "'" })
      .then(response => {
        queryOption.options = response.data
        queryOption.options.forEach(user => {
          allUser[user.userId] = user
        })
        queryOption.loading = false
      })
  }
}
export function getQueryUserName(userId) {
  return allUser[userId].fullName
}
export function putQueryUserName(user) {
  allUser[user.userId] = user
}

export function getUserListByDeptId(deptId) {
  return request({
    url: `/core/security/user/list/byDeptId/${deptId}`,
    method: 'get'
  })
}
