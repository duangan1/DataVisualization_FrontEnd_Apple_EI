import Vue from 'vue'
import i18n from './i18n'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
import '@/icons/iconfont/iconfont.css'

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n element-ui/lib/locale/lang/en

import '@/styles/index.scss' // global css
import '@/styles/table.scss'

import App from './App'
import store from './store'
import router from './router'
import custFieldSet from '@/components/CustFieldset'
import custSearchBar from '@/components/CustSearchBar'
import './icons' // icon
import './permission' // permission control
import { Button, Input } from 'element-ui'

const Elements = [Button, Input]
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

// set ElementUI lang to EN
Vue.use(ElementUI, {
  locale,
  size: localStorage.getItem('vue-size') || 'medium'
})

Elements.forEach(key => {
  Vue.use(key, {
    size: 'small'
  })
})
Vue.component('custFieldSet', custFieldSet)
Vue.component('custSearchBar', custSearchBar)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App)
})
