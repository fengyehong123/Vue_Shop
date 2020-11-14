import Vue from 'vue'
import Router from 'vue-router'

// 导入我们自定义的登录组件
// 传统导入组件的方式
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'

// 使用懒加载的方式导入我们自定义的Login组件
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
// 使用懒加载的方式导入我们自定义的Home组件
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
// 使用懒加载的方式导入我们自定义的欢迎组件
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

// 导入用户组件
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/Users.vue')
// 导入权限列表组件
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/Rights.vue')
// 导入角色列表组件
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/Roles.vue')

// 导入商品分类组件
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/Cate.vue')
// 导入参数组件
const Params = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/Params.vue')

// 导入商品列表组件
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/List.vue')
// 导入商品添加组件
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/Add.vue')

// 导入订单模块
const Order = () => import(/* webpackChunkName: "Order_Report" */ './components/order/Order.vue')
// 导入报表组件
const Report = () => import(/* webpackChunkName: "Order_Report" */ './components/report/Report.vue')

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
        { path: '/welcome', component: Welcome },
        // Users组件是Home的子组件
        { path: '/users', component: Users },
        // Rights组件是Home的子组件
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    },  
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
    return next()
  }

  // 如果用户访问的是需要登录之后才能看到的网页的话,需要先获取并校验token
  const tokenStr = window.sessionStorage.getItem("token");
  // 如果没有token的话,就强制跳转到登录页
  if(!tokenStr) return next("/login")
  // 如果有token,并且通过校验的话,就强制跳转到登录页面
  next()
})

// 将路由对象暴露出去
export default router
