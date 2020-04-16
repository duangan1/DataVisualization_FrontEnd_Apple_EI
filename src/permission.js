import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/pageTitle'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// no redirect whitelist
const whiteList = [
  '/login', '/404',
  '/public/questionnaire/edit/(\\d+)'
]

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info

          const { resources } = await store.dispatch('user/getInfo')

          // roles={}
          const accessRoutes = await store.dispatch('permission/generateRoutes', resources)
          // console.log("--->"+router.options.routes.length+">>"+accessRoutes.length)
          // router.options.routes=router.options.routes.concat(accessRoutes);
          router.addRoutes(accessRoutes)
          // console.log("--->"+router.options.routes.length)

          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    const nextPath = to.path
    const isInWhitelist = !!whiteList.find(pattern => new RegExp(pattern).exec(nextPath) != null)

    if (isInWhitelist) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${nextPath}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
