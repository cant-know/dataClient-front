import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/assets/index.less'
import '@/assets/font/iconfont.css'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios

Vue.prototype.$echarts = window.echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.wx = {}
