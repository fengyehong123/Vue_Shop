import Vue from 'vue'
// 按需导入我们需要用到的组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// Vue.use() 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
