<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 
                登录表单区域
                :rules="loginFormRules" 表单区域的验证对象
                ref="loginFormRef" 表单的实例对象,实例对象的名称可以任意取
             -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 
                    用户名
                    prop="username" 使用 loginFormRules中的username来进行用户名输入校验
                 -->
                <el-form-item prop="username">
                    <!-- 
                        prefix-icon 在输入框的前面添加图标
                        此处使用了非elementUI图标,使用的是阿里图标库
                     -->
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" 
                    prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <!-- 为重置按钮添加表单重置事件 -->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 登录表单绑定的数据对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮,重置登录表单
        resetLoginForm() {
            // loginFormRef 是我们自定义的表单对象的名称
            this.$refs.loginFormRef.resetFields();
        },
        // 表单登录之前的预验证
        login() {
            // validate中的回调函数,返回预验证的结果
            this.$refs.loginFormRef.validate(async (valid) => {
                // 如果没有通过校验,就不能发起请求
                if(!valid) return;
                /*
                    通过校验则发送ajax的post请求
                    ajax发送的请求返回一个对象,该对象有若干个属性,我们可以使用ES6的新语法
                    通过 {data: res} 来将对象中的data属性解构出来,解构出来的数据对象重命名为res
                */ 
                const {data: res} = await this.$http.post("login", this.loginForm);
                if(res.meta.status !== 200) {
                    // 使用了elementUI的message组件
                    return this.$message.error("登录失败!");
                }
                // 登录成功之后之后的信息提示
                this.$message.success("登录成功!");
                // 将项目登录成功之后的token保存到客户端的sessionStorage中
                // token的具体的值是由后端返回给前端的
                window.sessionStorage.setItem("token", res.data.token);
                
                // 通过编程式导航跳转到后台主页,路由地址是 /home
                this.$router.push("/home");
            });
        }
    }
}
</script>

<!-- 
    scope: 用来控制样式的作用域.我们在单文件组件中添加了scoped,
    意味着此样式只作用于当前组件.如果不添加scoped,就会作用于全部的组件样式
    在单文件组件中,推荐使用 scoped
-->
<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: relative;
        left: 50%;
        top: 50%;
        // 配合left 和 top 使盒子处于屏幕中央
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            // 图片和边框之间添加边距
            padding: 10px;
            // 添加阴影效果
            box-shadow: 0 0 10px #ddd;
            position: absolute;  
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    
    .login_form {
        position: absolute;
        width: 100%;
        bottom: 0;
        // 原本设置padding会撑大盒子,但是由于我们添加了box-sizing: border-box; 所以不会撑大盒子
        padding: 0 20px;
        // CSS3语法,border和padding的设置不会撑大盒子,不会影响盒子的宽高
        box-sizing: border-box;
    }

    .btns {
        // 弹性盒模型
        display: flex;
        justify-content: flex-end;
    }
</style>