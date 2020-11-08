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
// 导入第三方的表格插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入第三方的富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入第三方富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 设置ajax请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

// 在将axios请求挂载到Vue原型之前,先给axios请求拦截器添加token,保证拥有获取数据的权限
// use可以给请求添加一个回调函数,回调函数中的config就是进行配置对象
axios.interceptors.request.use(config => {
  // 为请求头对象添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 最后要把配置对象给返回
  return config;
});

// 将axios挂载到Vue的原型对象上,这样每一个vue对象都可以直接通过this直接访问$http,从去发送ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 将第三方插件注册到Vue的全局可用组件中,参数1: 自定义的组件名称 参数2: 引入的插件对象
// 因为我们把组件名称定义为 tree-table了,所以使用的时候,直接<tree-table>就可以直接使用了
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

// 定义一个全局的时间过滤器
Vue.filter("dataFormat", function(originVal) {
  // 通过传入的事件参数,构建出一个时间对象
  const dt = new Date(originVal)
  // 获取4位数的年
  const y = dt.getFullYear()
  // 获取月份(要求是两位数,不足两位补0)
  // dt.getMonth() + 1 + '' 数字转字符串
  // .padStart(2, '0') 要求字符串是两位,不足两位的话,用0来补齐
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 获取当前的日期
  const d = (dt.getDate() + '').padStart(2, '0')
  // 获取时分秒
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
