<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <!-- 退出按钮组件 -->
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 
                侧边栏
                当侧边栏被折叠之后,显示64px(变小),反之200px,变大
             -->
            <el-aside :width="isCollapse ? '64px': '200px' ">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 
                    侧边栏菜单区域
                    active-text-color: 激活的文本的颜色
                    :unique-opened="true" 每一次只允许一个侧边栏展开
                    :collapse="true" 菜单栏的展开与折叠
                    :collapse-transition="false" 取消菜单栏折叠时的动画效果(原生自带的动画效果很丑)
                    :router="true" 对整个侧边栏开启了路由模式
                        是否使用vue-router的模式,启用该模式会在激活导航的时候
                        以index的值作为path进行路由跳转
                    :default-active="activePath"
                        当前激活菜单的index,指定的index会被高亮(我们点击的左侧侧边栏菜单会被高亮)
                 -->
                <el-menu background-color="#333744" 
                text-color="#fff" 
                active-text-color="#409FFF"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition="false"
                :router="true"
                :default-active="activePath"> 
                    <!-- 
                        一级菜单
                        :index="item.id" 每一个菜单栏独有的id,用来指定每一个菜单栏的展开和关闭
                        因为:index只能接收字符串,因此需要把数值通过拼接空字符串的方式转换为字符串
                     -->
                    <el-submenu :index="item.id + '' " v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 一级菜单栏图标,图标根据导航栏的id从图标对象中获取 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 一级菜单栏文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 
                            二级菜单
                            :index="subItem.path
                                我们给侧边栏开启了路由模式,
                                启用该模式会在激活导航的时候,会以index的值作为path进行路由跳转
                             @click="saveNavState('/' + subItem.path)"
                         -->
                        <el-menu-item :index="'/' + subItem.path" 
                        v-for="subItem in item.children" 
                        :key="subItem.id"
                        @click="saveNavState('/' + subItem.path)">
                            <!-- 二级菜单的模板区域 --> 
                            <template slot="title">
                                <!-- 二级菜单栏图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 二级菜单栏文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符,把路由对应的组件展示在此处 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单栏数据
            menuList: [],
            // 字体图标对象
            iconsObj: {
                // 第一导航栏的id: 导航栏的图标类名
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao',
            },
            // 控制菜单栏的展开与折叠
            isCollapse: false,
            // 被点击激活的左侧侧边栏链接地址
            activePath: ''
        }
    },
    // 生命周期函数,当页面一加载就请求后端获取数据
    created(){ 
        this.getMenuList();
        // 当页面一加载就从sessionStorage中获取用户点击的是那个左侧侧边栏项目
        this.activePath = window.sessionStorage.getItem("activePath");
    },
    methods: {
        logout() {
            // 清空存储的token
            window.sessionStorage.clear();
            // 强制跳转到登录页面
            this.$router.push("/login");
        },
        // 获取所有的菜单信息
        async getMenuList() {
            // 调用后端接口获取数据,因为我们使用的是axios方法,因此返回的是一个Promise对象,
            // 我们使用async 和 await 方式可以简化操作,通过解构赋值直接获取到Promise对象中的data属性值
            const {data: res} = await this.$http.get("menus");
            if(res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }

            this.menuList = res.data;
        },
        // 点击按钮,切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存链接的激活状态到sessionStorage中
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath);
            this.activePath = activePath;
        }
    }
}
</script>

<style lang="less" scoped>
    // 让布局容器占满整个屏幕
    .home-container {
        height: 100%;
    }
    .el-header {
        background-color: #373d41;
        // 使用flex布局
        display: flex;
        // 让元素左右贴边对齐
        justify-content: space-between;
        // 清空左侧的空白
        padding-left: 0;
        // 弹性盒元素,居中对齐
        align-items: center;
        // 文本内容美化
        color: #fff;
        font-size: 20px;
        div {
            display: flex;
            // 居中对齐
            align-items: center;
            // 文字和图片之间的间距
            span {
                margin-left: 15px;
            }
        }
    }
    .el-aside {
        background-color: #333744;
        // 将菜单栏的边框线设置为不存在,解决菜单栏边框线突出的问题
        .el-menu {
            border-right: none;
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    // 菜单栏的图标和菜单栏字体之间保留间距
    .iconfont {
        margin-right: 10px;
    }
    // 菜单栏展开折叠按钮的样式
    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;  
        line-height: 24px;
        color: #fff;
        text-align: center;
        // 增加或减少字符间的空白(字符间距)
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>