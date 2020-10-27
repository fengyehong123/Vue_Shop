import Vue from 'vue'
import Router from 'vue-router'
// 导入我们自定义的路由组件
import Login from './components/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    /* 当用于访问的是根路径/的时候,重定向到 /login 地址 */
    { path: '/', redirect: "/login" },
    /* 我们自定义的路由规则,当访问 /login 路径的时候,会路由到Login组件 */
    { path: '/login', component: Login }
  ]
})
