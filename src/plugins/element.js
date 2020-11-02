import Vue from 'vue'
// 按需导入我们需要用到的组件
import { 
    Button, 
    Form, 
    FormItem, 
    Input, 
    Message, 
    Container, 
    Header, 
    Aside, 
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui'

// Vue.use() 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// $message是我们自定义的属性名称,Message是我们导入的组件的名称
// 下面的代码代表把弹窗组件挂载到Vue的原型对象上,这样的话每一个组件都可以通过this访问到$message
Vue.prototype.$message = Message

// MessageBox组价比较特殊,不能使用Vue.use()的方式来使用.需要挂载到Vue的原型对象上
// 我们此时只引入了MessageBox中的confirm组件
Vue.prototype.$confirm = MessageBox.confirm
