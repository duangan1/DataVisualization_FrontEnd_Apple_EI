import { constantRoutes, generateRoutes } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  // addRoutes: [],
  menus: [],
  buttons: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    state.menus = constantRoutes.concat(menus)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = []
      const accessedMenus = []
      const buttons = []
      generateRoutes(menus, accessedRoutes, accessedMenus, buttons)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_MENUS', accessedMenus)
      commit('SET_BUTTONS', buttons)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
