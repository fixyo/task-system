// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import qs from 'qs'
import axios from 'axios'

// 组织架构图组件
import OrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import Print from 'vue-print-nb'

// 写在全局变量里面了
// 图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true
Vue.use(OrgTree)
// 打印插件
Vue.use(Print) // 注册

Vue.prototype.$axios = axios
window.$qs = qs
Vue.use(ElementUI)
Vue.use(Viewer)
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')
//这是正常的全局注册
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});
//由于iview已经更新到3 但iView-admin2.0中配置了国际化 vue-i18n和iview之间有兼容问题故作以下处理
// Vue.use(iView, {
//     i18n: function(path, options) {
//         let value = i18n.t(path, options);
//         if (value !== null && value !== undefined) return value;

//         return '';
//     }
// });
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
window.bus =new Vue()

let canNoticeLoginOut = true
// axios拦截器,用于对session过期跳转到登录页面
vm.$axios.interceptors.response.use(function (response) {
  // 拦截未登录，跳转到登录页面
  if(response.data.message=='未登录'&&canNoticeLoginOut){
    vm.$Notice.warning({
      title:'登录过期请重新登录',
      duration: 1,
      name:'timeOut',
      onClose:()=>{
        canNoticeLoginOut = true
      }
    });
    //清除本地token
    localStorage.token=''
    vm.$router.push({
      name:'login'
    })
    canNoticeLoginOut = false
    return response
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});