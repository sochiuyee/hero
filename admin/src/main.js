import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

Vue.config.productionTip = false

// 挂载axios实例到Vue原型上,在任何页面上使用this.$http请求数据
import http from './http.js'
Vue.prototype.$http = http

Vue.mixin({
  computed:{
    $_myMixin_uploadUrl(){
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods:{
    $_myMixin_getAuthHeaders(){
      return {
        Authorization:`Bearer ${localStorage.token || ''}`
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
