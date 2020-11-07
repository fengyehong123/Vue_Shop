<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮,按钮自己独占一行,因此用到了el-row组件 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 
                表格组件,此处我们使用的是非element的第三方表格插件<tree-table>的标签名是我们自己定义的
                :data="cateList" 表格的数据源
                :columns="columns" 表格列对象的配置
                :selection-type="false" 是否为多选类型的表格(设置为false就移除了复选框)
                :expand-type="false" 是否为展开类型的表格(为true的时候,需要添加名称为'$expand'的作用域插槽,可以获取到row,rowIndex)
                :show-index="true" 让其显示索引列
                index-text="#" 自定义索引列的标题(默认标题是 序号)
                :border="true" 是否显示表格之间的纵向分割线
                :show-row-hover="false" 是否显示行的高亮效果
            -->
            <tree-table 
            class="treeTable"
            :data="cateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            :show-index="true"
            index-text="#"
            :border="true"
            :show-row-hover="false">
                <!-- isOK是我们指定的模板名称 -->
                <template slot="isOK" slot-scope="scope">
                    <!-- 指定模板中要显示的小图标 -->
                    <i style="color: lightgreen;" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                    <i style="color: red;" class="el-icon-error" v-else></i>
                </template>
                <!-- 排序的模板 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success" >二级</el-tag>
                    <el-tag size="mini" v-else type="warning">三级</el-tag>
                </template>
                <!-- 操作的模板opt -->
                <template slot="opt">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页组件 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed">
            <!-- 对话框中的表单区域 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- 
                      级联选择器  
                      :options="parentCateList" 用来指定级联选择器的数据源
                      expand-trigger = "hover" 指定通过鼠标移入方式触发
                      :props="" 用来指定配置对象
                      v-model="selectedKeys" 将我们选中的值双向绑定到data中
                      @change="函数名称" 级联选择器选中的对象发生了变化就会触发该函数
                      :clearable="true" 是否支持选中的内容被清空(默认值为false)
                      :change-on-select="true" 是否允许选中任意一级的选项(默认只允许选择最后一个级别的)
                     -->
                    <el-cascader
                    v-model="selectedKeys"
                    :options="parentCateList"
                    expand-trigger = "hover"
                    :props="cascaderProps"
                    @change="parentCateChanged"
                    :clearable="true"
                    :change-on-select="true">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo: {
                // 查询3级分类
                type: 3,
                // 默认查询第一页
                pagenum: 1,
                // 默认一页显示5条
                pagesize: 5
            },
            // 商品分类的数据列表,默认为空
            cateList: [],
            // 总的数据条数
            total: 0,
            // 为表格插件指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                // 模板列
                {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示这一列使用的模板名称
                    template: 'isOK'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }

            ],
            // 控制分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加的分类名称
                cat_name: '',
                // 父级分类的id(默认为0)
                cat_pid: 0,
                // 分类层级(默认添加的是一级分类)
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                // 指定我们通过级联选择器选中的那个值
                value: 'cat_id',
                // 指定我们看到的值
                label: 'cat_name',
                // 指定父子嵌套的属性
                children: 'children'
            },
            // 选中的父级分类的ID数组
            selectedKeys: []
        }
    },
    // 声明周期函数
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const {data: res} = await this.$http.get(`categories`, {
                params: this.queryInfo
            })
            if(res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败!")
            }

            // 将后端返回的商品分类信息赋值给数据对象
            this.cateList = res.data.result
            // 为商品的总条数赋值
            this.total = res.data.total
        },
        // 监听分页组件中pagesize的改变
        handleSizeChange(newSize) {
            // 给查询对象中的pagesize属性赋新值
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 显示添加分类对话框
        showAddCateDialog() {
            // 先获取父级分类的数据列表
            this.getParentCateList()
            // 展示出对话框
            this.addCateDialogVisible = true
        },
        // 获取父级分类列表
        async getParentCateList() {
            const {data: res} = await this.$http.get(`categories`, {
                // 2代表的是第2级别的分类(一共3级)
                params: {type: 2}
            })
            if(res.meta.status !== 200) {
                return this.$message.error("查询分类级别失败!")
            }
            
            // 将查询到的父级分类数据赋值到数据对象中去
            this.parentCateList = res.data
        },
        // 级联选择器中的选择项发生变化时触发这个函数
        parentCateChanged() {
            // 如果selectedKeys数组中的length > 0,则证明选中了父级分类
            // 反之,只添加了分类名称,没有在级联选择器中选择任何分类
            if(this.selectedKeys.length > 0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 为当前分类的等级赋值(分类的等级等于数组的长度)
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                // 如果没有在级联选择器中选择任何分类的话,就让父级分类id和等级都设置为0
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 点击按钮,添加新的分类
        addCate() {
            // 进行表单预验证
            this.$refs.addCateFormRef.validate(async valid => {
                // 如果通不过校验
                if(!valid) {
                    return
                }

                // 通过校验就发起网络请求
                const {data: res} = await this.$http.post(`categories`, this.addCateForm)
                if(res.meta.status !== 201) {
                    return this.$message.error("添加分类失败!")
                }

                this.$message.success("添加分类成功!")
                // 刷新数据列表
                this.getCateList()
                // 隐藏对话框
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件,重置表单数据
        addCateDialogClosed() {
            // 通过表单的引用对象来重置分类信息
            this.$refs.addCateFormRef.resetFields()
            // 重置级联选择框信息
            this.selectedKeys = []
            // 重置等级和ID
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable {
     margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>