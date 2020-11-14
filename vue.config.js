module.exports = {
    // 通过 chainWebpack 节点来自定义打包配置
    chainWebpack: config => {
        // process.env.NODE_ENV: 固定写法,用来获取当前项目的发布模式

        // 发布模式
        config.when(process.env.NODE_ENV ==='production', config => {
            /*
                config.entry('app').clear(): 清空默认的打包入口文件
                .add('./src/main-prod.js'): 增加我们自定义的打包入口文件
            */
            config.entry('app').clear().add('./src/main-prod.js')

            // 只有在发布模式的情况下才有必要通过externals来加载外部的CDN资源
            config.set('externals',{
                /*
                    lodash是我们导入的包名
                    当配置externals之后,项目并不会直接直接把lodash包合并到我们的打包文件中
                    而是去项目全局查找 _ 对象(我们把导入的lodash包名自定义为 _),并直接进行使用
                */
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'NProgress',
                'vue-quill-editor':'VueQuillEditor'
            })
            
            // 通过html插件来控制页面内容的加载
            config.plugin('html').tap(args => {
                /*
                    添加参数isProd
                    我们可以通过 isProd 的结果是true或者false来控制页面的加载内容和CDN
                    isprod是我们自定义的属性,名字可以随意
                */ 
                args[0].isProd = true
                return args
            })
        })
        
        // 开发模式
        config.when(process.env.NODE_ENV ==='development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}