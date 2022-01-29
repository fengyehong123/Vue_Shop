import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  // 在vue实例中挂载vuex实例
  store,
  render: h => h(App)
}).$mount('#app')
