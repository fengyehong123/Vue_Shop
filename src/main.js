import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入第三方的字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios请求库
import axios from 'axios'

// 将axios挂载到Vue的原型对象上,这样每一个vue对象都可以直接通过this直接访问$http,从去发送ajax请求
Vue.prototype.$http = axios
// 设置ajax请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
