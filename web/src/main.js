import Vue from 'vue'
import App from './App.vue'

import "./assets/iconfont/iconfont.css"

import "./assets/scss/style.scss"
import router from './router'

import axios from 'axios'
Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/web/api"
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
