import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'index', icon: 'home', affix: true }
      },
      {
        path: 'userProfile',
        name: 'UserProfile',
        hidden: true,
        component: () => import('@/views/core/security/user/userProfile'),
        meta: { title: 'userProfile', icon: 'userProfile' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/form3',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form2',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form2', icon: 'form' }
      }
    ]
  }
]

function generateRouteInfo(menu) {
  const menu_ = {}
  menu_.path = menu.path
  menu_.meta = {}

  if (menu.component === 'Layout') {
    menu_.component = Layout
  } else if (menu.component) {
    // menu_.component = () => import(`@/views/${menu.component}`)
    menu_.component = resolve => require([`@/views/${menu.component}`], resolve)
    // 解决方法详见 https://blog.csdn.net/Cookysurongbin/article/details/99307933 的评论
  }

  if (menu.name) {
    menu_.name = menu.name
  }
  if (menu.title) {
    menu_.meta.title = menu.title
  }
  if (menu.icon) {
    menu_.meta.icon = menu.icon
  }
  if (menu.noCache) {
    menu_.meta.noCache = menu.noCache
  }
  if (menu.hidden) {
    menu_.hidden = menu.hidden
  }
  if (menu.redirect) {
    menu_.redirect = menu.redirect
  }
  if (menu.fastAccess) {
    menu_.fastAccess = menu.fastAccess
  }
  return menu_
}
function generateMenu(menu) {
  const menu_ = generateRouteInfo(menu)
  if (menu.children) {
    menu_.children = []
    menu.children.forEach(children => {
      if (children.type === 'menu') {
        const childrenMenu = generateMenu(children)
        menu_.children.push(childrenMenu)
      }
    })
  }
  return menu_
}

function generateRuterSub(router, rouers_, buttons) {
  const router_ = generateRouteInfo(router)
  rouers_.push(router_)
  if (router.children) {
    router.children.forEach(children => {
      if (children.type === 'menu') {
        generateRuterSub(children, rouers_, buttons)
      } else if (children.type === 'menuButton') {
        buttons.push(children.menuButtonName)
      }
    })
  }
}

export function generateRoutes(menus, accessedRoutes, accessedMenus, buttons) {
  let menu_, router_

  menus.forEach(menu => {
    menu_ = generateRouteInfo(menu)
    router_ = Object.assign({}, menu_)
    const rouers_ = []
    if (menu.children) {
      menu_.children = []
      router_.children = []
      menu.children.forEach(children => {
        if (children.type === 'menu') {
          menu_.children.push(generateMenu(children))
          generateRuterSub(children, rouers_, buttons)
        } else if (children.type === 'menuButton') {
          buttons.push(children.menuButtonName)
        }
      })
      router_.children = router_.children.concat(rouers_)
    }
    accessedRoutes.push(router_)
    accessedMenus.push(menu_)
    console.log(accessedMenus)
  })
  // ouers.push(asyncRoutes[0]);

  accessedMenus.push({ path: '*', redirect: '/404', hidden: true })
  accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
}

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
