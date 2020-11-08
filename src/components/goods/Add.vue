<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- :closable="false" 将警告区域设置为不可删除的状态 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false" />

            <!-- 
                步骤条区域
                :align-center="true" 步骤条区域字体居中显示
                :active="0" 用来控制激活项的索引(第一项索引为0,第二项索引为1)
                    activeIndex - 0 把字符串转换为数值
             -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" :align-center="true">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 
                Tab栏中有很多个面板,多个面板共同组成一个商品信息对象因此我们把Tab栏包裹在Form表单中
                label-position="top" 指定label在文本框之上
             -->
            <el-form :model="addForm" :rules="addFormRules" 
            ref="addFormRef" label-width="100px" label-position="top">
                <!-- 
                    Tab栏区域
                    :tab-position=" 'left' " 
                        控制Tab栏的位置,我们指定为永远在左侧
                    Tab面板中我们点击的是第一个面板,就会把第一个面板中的name属性对应的值(0),赋值到v-model绑定的数据对象中
                        由于Tab栏和步骤条使用的都是同一个数据对象,因此当切换Tab栏的时候,步骤条也会进行相应的改变
                    :before-leave="beforeTabLeave"
                        切换标签之前的钩子,若返回false或者返回Promise且被reject,则阻止切换.
                    @tab-click="tabClicked"
                        当面板标签被点击的时候触发
                 -->
                <el-tabs v-model="activeIndex" :tab-position=" 'left' " 
                :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <!-- prop="goods_name" 校验规则的名称 -->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <!-- type="number" 规定文本输入框只能输入数值 -->
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 
                                v-model="addForm.goods_cat" 级联选择器选择之后,把数据保存到的位置
                                :options="cateList" 级联选择器的数据源
                                :props="cateProps" 级联选择器的配置对象
                             -->
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            expandTrigger= 'hover'
                            :props="cateProps"
                            @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的Item项目 --> 
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <!-- border 给复选框添加边框 -->
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 循环遍历静态属性列表 -->
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <!-- v-model="item.attr_vals" 文本输入框双向绑定 -->
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 
                            上传组件
                            action 图片要上传到的后台API地址
                            :on-preview="图片预览操作"
                            :on-remove="图片移除操作"
                            list-type="picture" 通过指定不同的值,让上传组件显示不同的UI效果(纯文本,缩略图等等)
                            :headers="在上传的时候指定头部携带信息"
                                我们在main.js中设置了axios的过滤器,每发送一次ajax请求都会携带token
                                但是upload组件自己封装了一套ajax方法,不使用axios
                                因此我们需要自己手动添加token认证信息
                            :on-success="图片上传成功后的钩子函数"
                         -->
                        <el-upload
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="headerObj"
                        :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <!-- 提示消息 -->
                            <div slot="tip" style="margin-top: 10px">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce" />
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
            <img class="previewImg" :src="previewPath" alt="">
        </el-dialog>
    </div>
</template>

<script>
// 导入lodash工具类,官方建议使用 _ 来当做对象名称
import _ from 'lodash'
export default {
    data() {
        return {
            // 步骤条被激活的索引(默认为0)
            activeIndex: 0,
            // 添加商品的表单数据对象
            addForm: {
                // 商品名称
                goods_name: '',
                // 商品价格
                goods_price: 0,
                // 商品重量,
                goods_weight: 0,
                // 商品数量
                goods_number: 0,
                // 商品所属的分类数组(级联选择器选中的数据就保存到此处)
                goods_cat: [],
                // 图片的数组
                pics: [],
                // 商品的详情描述
                goods_introduce: '',
                // 商品的参数(数组),包含动态参数和静态属性
                attrs: []
            },
            // 表单的校验对象
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ]
            },
            // 商品分类列表(供级联选择器使用)
            cateList: [],
            // 级联选择器的配置对象
            cateProps: {
                // 看到的
                label: 'cat_name',
                // 选中的值
                value: 'cat_id',
                // 哪个属性实现父子节点的嵌套
                children: 'children',
            },
            // 动态参数列表数据
            manyTableData: [],
            // 静态属性列表数据
            onlyTableData: [],
            // 上传图片的URL地址
            uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
            // 图片上传组件的headers请求头对象
            headerObj: {
                // 从sessionStorage中获取保存好的token值放入请求头中
                Authorization: window.sessionStorage.getItem("token")
            },
            // 图片预览的地址
            previewPath: "",
            // 对话框显示与否
            previewVisible: false
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有商品分类数据
        async getCateList() {
            const {data: res} = await this.$http.get("categories")
            if(res.meta.status !== 200) {
                return this.$message.error("获取商品分类数据失败")
            }

            // 把后端返回的商品分类数据赋值到商品分类对象中
            this.cateList = res.data
        },
        // 级联选择器选中时触发
        handleChange() {
            if(this.addForm.goods_cat.length !== 3) {
                // 如果级联选择器中选择的不是第三级,那么数组的长度不可能为3
                // 这种情况下清空数组,让用户不能选中
                this.addForm.goods_cat = []
            }
        },
        // 标签页切换之前的钩子函数
        // activeName => 即将进入的标签页的名称
        // oldActiveName => 即将离开的标签页的名称
        beforeTabLeave(activeName, oldActiveName) {
            // 如果是第一个标签页,并且标签页的长度 < 3(说明级联选择器没有选择第3行)
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error("请先选择商品分类")
                // 不符合条件,返回false,阻止面板切换
                return false;
            }
        },
        // 面板标签被点击的时候触发
        async tabClicked() {
            // 如果索引为1,说明点击的是商品参数面板
            if(this.activeIndex === '1') {
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {sel: 'many'}
                })
                if(res.meta.status !== 200) {
                    return this.$message.error("获取动态参数列表失败!")
                }

                res.data.forEach(item => {
                    // 长度为0就返回空数组,否则以空格为依据对字符串进行分割,形成一个数组
                    // 每一个item中的attr_vals由字符串变成了数组
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
                })
                // 把后端返回的数据保存到数据对象中
                this.manyTableData = res.data
            } else if(this.activeIndex === '2') {
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {sel: 'only'}
                })
                if(res.meta.status !== 200) {
                    return this.$message.error("获取静态属性失败!")
                }

                // 把后端返回的数据保存到数据对象中
                this.onlyTableData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            this.previewPath = file.response.data.url
            // 让对话框展示
            this.previewVisible = true
        },
        // 处理移除图片的操作
        // file就是要被移除的图片的对象
        handleRemove(file) {
            // 获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // 从pics数组中,找到这个图片对应的索引值
            const i = this.addForm.pics.findIndex(x => {
                x.pic === filePath
            })
            // 调用数组的splice()方法,把图片信息对象从pics数组中移除
            this.addForm.pics.splice(i, 1)
        },
        // 图片上传成功之后的钩子函数
        handleSuccess(response) {
            // 拼接得到一个图片信息对象
            const picInfo = {pic: response.data.tmp_path}
            // 将图片信息对象添加到pics数组中
            this.addForm.pics.push(picInfo)
        },
        // 添加商品
        add() {
            // 添加商品之前先进行表单的预验证
            this.$refs.addFormRef.validate(async valid => {
                // 如果没有通过预验证
                if(!valid) {
                    return this.$message.error("请填写必要的表单项!")
                }

                // 通过验证之后就可以执行添加的业务逻辑
                /*
                    级联选择器要求一个数组
                    而我们发送网络请求是需要把数组转化为字符串,这样的需要与级联选择器矛盾
                    因此我们使用lodash库中的.cloneDeep()方法,深拷贝一个新的对象
                    然后在新对象中转换为字符串,这样就不会产生冲突了
                */
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                
                // 处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        // 动态属性的value值是一个数组,将数组转换为字符串
                        attr_value: item.attr_vals.join(' ')
                    }
                    // 将处理后的动态参数添加
                    this.addForm.attrs.push(newInfo)
                })

                // 处理静态属性
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        // 静态属性的value值本来就是一个字符串,因此无需转换
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })

                // addForm.attrs属性赋值给我们深拷贝出来的this.form对象中
                form.attrs = this.addForm.attrs

                // 发起请求添加商品 商品的名称必须是唯一的
                const {data: res} = await this.$http.post('goods', form)
                if(res.meta.status !== 201) {
                    return this.$message.error("添加商品失败")
                }

                this.$message.success("添加商品成功!")

                // 通过编程式导航跳转到新页面
                this.$router.push('/goods')
            })
        }
    },
    // 计算属性
    computed: {
        cateId() {
            // 如果选中的是3级分类,返回选中的内容
            if(this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2];
            }

            return null;
        }
    }
}
</script>

<style lang="less" scoped>
// 使用自定义的样式覆盖默认的样式
.el-checkbox {
    margin: 0 10px 0 0 !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}
</style>