import Vue from 'vue'
// 按需导入我们需要用到的组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// Vue.use() 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// $message是我们自定义的属性名称,Message是我们导入的组件的名称
// 下面的代码代表把弹窗组件挂载到Vue的原型对象上,这样的话每一个组件都可以通过this访问到$message
Vue.prototype.$message = Message
