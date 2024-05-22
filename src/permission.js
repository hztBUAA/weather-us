import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import router from './router'
import store from './store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // no redirect whitelist

const hasPermission = (to, token, next) => {
  const role = token === 'true' ? 'admin' : 'user'
  if (to.meta.roles) {
    if (to.meta.roles.includes(role)) {
      next()
    } else {
      next({ path: '/404' })
    }
  } else {
    next()
  }
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const token = getToken()

  if (token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/map' })
      NProgress.done()
    } else if (to.path === '/404') {
      next()
    } else {
      const hasGetUserInfo = store.getters.avatar
      if (hasGetUserInfo) {
        hasPermission(to, token, next)
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          hasPermission(to, token, next)
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else if (to.path === '/admin' || to.path === '/user' || to.path === 'notice') {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    } else {
      // all can be accessed unless the above page
      next({ path: '/map' })
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
