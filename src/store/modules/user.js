import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { openSocket } from '@/utils/webSocketUtils'
import { resetRouter } from '@/router'
import Vue from 'vue'
import { Button, Input } from 'element-ui'
const Elements = [Button, Input]
const state = {
  token: getToken(),
  userId: '',
  // 登录账号
  name: '',
  userName: '',
  // 姓名
  fullName: '',
  avatar: '',
  resources: {},

  userRoleIds: [],
  userRoles: []

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_FULLNAME: (state, fullName) => {
    state.fullName = fullName
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_RESOURCES: (state, resources) => {
    state.resources = resources
  },
  SET_SIZE: (state, size) => {
    state.size = size
    localStorage.setItem('vue-size', size)
  },

  SET_USER_ROLE_IDS: (state, roleIds) => {
    state.userRoleIds = roleIds
  },
  SET_USER_ROLES: (state, roles) => {
    state.userRoles = roles
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { userName, fullName, avatar, resources, roles, userId, layoutSize, roleIds } = data
          commit('SET_RESOURCES', resources)
          commit('SET_NAME', userName)
          commit('SET_USERNAME', userName)
          commit('SET_FULLNAME', fullName)
          commit('SET_USER_ID', userId)
          commit('SET_AVATAR', avatar)
          commit('SET_SIZE', layoutSize)
          commit('SET_USER_ROLE_IDS', roleIds)
          commit('SET_USER_ROLES', roles)
          openSocket(userId)
          Vue.prototype.$ELEMENT = { size: layoutSize }
          Elements.forEach(key => {
            Vue.use(key, {
              size: 'small'
            })
          })
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_RESOURCES', '')
          commit('SET_NAME', '')
          commit('SET_USERNAME', '')
          commit('SET_FULLNAME', '')
          commit('SET_USER_ID', '')
          commit('SET_AVATAR', '')
          commit('SET_SIZE', '')
          commit('SET_USER_DEPARTMENT_NAME', '')
          commit('SET_USER_DEPARTMENT_ID', '')
          commit('SET_USER_DATA_BELONG', [])
          commit('SET_USER_ROLE_IDS', [])
          commit('SET_USER_ROLES', [])
          commit('SET_USER_DEPARTMENTS', [])
          commit('SET_USER_UP_DEPARTMENTS', [])
          commit('SET_USER_DOWN_DEPARTMENTS', [])
          commit('SET_USER_SIBLING_DEPARTMENTS', [])
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
