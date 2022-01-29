import Vue from 'vue'
import App from './App.vue'
// 导入 ant-design-vue 组件库
import Antd from 'ant-design-vue'
// 导入组件库的样式表
import 'ant-design-vue/dist/antd.css'
// 导入vuex的入口文件
import store from './store.js'

Vue.config.productionTip = false

// 将安装的组件库对象挂载到全局Vue对象中
Vue.use(Antd)

new Vue({
  render: h => h(App),
  // 将vuex挂载到Vue对象中
  store
}).$mount('#app')
