import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
// import axios from 'axios'
import store from '@/store'
import iView from 'iview'
import tableTree from 'vue-table-with-tree-grid'
import { setToken, getToken, canTurnTo } from '@/libs/util'
// import {
//   baseUrl
// } from '@/api/base.js'
// import {getUserInfo} from '@/store/module/user.js'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
Vue.use(tableTree)
const router = new Router({
  routes,
  // mode: 'history'
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  // 2019.8.9注释，原因在于退出登录会重复报登录过期
  // axios({
  //   url: baseUrl + '/login/getuser',
  //   data: $qs.stringify(),
  //   method: 'post'
  // })
  //   .then(resp => {
  //     if (resp.data.code === 200) {
  //       router.app.$options.store.state.user.userpermission = resp.data.permission
  //       router.app.$options.store.state.user.menuPermission = resp.data.menu
  //     } else {
  //       // this.$Message.error(resp.data.msg)
  //     }
  //   })
  //   .catch(err => {
  //     console.log('err', err)
  //   })
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    // store.dispatch('getUserInfo')
    // 下面这部分先注释掉，权限和getUserInof暂时用不到
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, Object.keys(user.menu), next)
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
