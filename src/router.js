import Vue from 'vue'
import Router from 'vue-router'
// 导入我们自定义的登录组件
import Login from './components/Login.vue'
// 导入我们自定义的Home组件
import Home from './components/Home.vue'
// 导入我们自定义的欢迎组件
import Welcome from './components/Welcome.vue'

Vue.use(Router)

// 定义一个路由对象
const router = new Router({
  routes: [
    /* 当用于访问的是根路径/的时候,重定向到 /login 地址 */
    { path: '/', redirect: "/login" },
    /* 我们自定义的路由规则,当访问 /login 路径的时候,会路由到Login组件 */
    { path: '/login', component: Login },
    /* 
      我们自定义的home组件,home组件中还有一个嵌套的Welcome子组件,
      因此我们在home路由中嵌套子路由
      redirect: '/welcome'
        添加重定向功能,每当访问/home路径的时候,就重定向到/welcome路径中,访问welcome组件
    */
    { path: '/home', 
      component: Home, 
      redirect: '/welcome',
      children: [
      { path: '/welcome', component: Welcome }
    ]},
  ]
})

/*
  挂载路由导航守卫,保证没有token的访问不会成功,而是挑战到登录页面
  to: 将要访问的路径
  from: 代表从哪个路径跳转而来
  next:
    next() 放行
    next("/login") 强制跳转
*/ 
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页,直接放行
  if(to.path === "/login"){
    return next();
  }

  // 如果用户访问的是需要登录之后才能看到的网页的话,需要先获取并校验token
  const tokenStr = window.sessionStorage.getItem("token");
  // 如果没有token的话,就强制跳转到登录页
  if(!tokenStr) return next("/login");
  // 如果有token,并且通过校验的话,就强制跳转到登录页面
  next();
})

// 将路由对象暴露出去
export default router
