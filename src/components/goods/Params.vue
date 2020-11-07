<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 
                警告区域
                :closable="false" 警告框禁止关闭(默认是可以关闭的)
                :show-icon="true" 显示默认的图标
             -->
            <el-alert title="注意: 只允许为第三极分类设置相关参数!" type="warning" :closable="false" :show-icon="true"></el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类: </span>
                    <!-- 
                        选择商品分类的级联选择框
                        :options="cateList" 用来指定级联选择框的数据源
                        :props="cateProps" 级联选择器的配置对象
                     -->
                    <el-cascader
                    v-model="selectedCateKeys"
                    :options="cateList"
                    expandTrigger= 'hover'
                    :props="cateProps"
                    @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- 
                tab 页签区域
                v-model="activeName" 
                    activeName 对象中存放着我们要激活的页面名称,默认是激活name="many"的TabPane
             -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 
                        添加参数的按钮
                        :disabled="isBtnDisabled" 控制按钮禁用与否的选项(绑定了计算属性)
                        当用户选择的是不是第三级别的时候,按钮禁用的
                     -->
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <!-- 作用域插槽 -->
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" :closable="true" @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 
                                    输入文本框
                                    v-if="scope.row.inputVisible" 控制显示与隐藏
                                    为了防止输入框输入数据的联动,给每一行都绑定了自己的数据对象
                                    ref="saveTagInput" input输入框的对象
                                 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态参数的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <!-- 作用域插槽 -->
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" :closable="true" @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 
                                    输入文本框
                                    v-if="scope.row.inputVisible" 控制显示与隐藏
                                    为了防止输入框输入数据的联动,给每一行都绑定了自己的数据对象
                                    ref="saveTagInput" input输入框的对象
                                 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 
            添加参数的对话框
            我们让动态参数和静态属性都共用一个对话框
            对话框的标签是动态生成的
                :title=" '添加' + titleText " 其中titleText用到了计算属性(动态计算标题的名称)
         -->
        <el-dialog
        :title=" '添加' + titleText "
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <!-- 
                    因为对话框被动态参数和静态属性共用,所以label的值不能写死
                    因此label="" -> :label="titleText"(变为动态绑定的方式)
                        其中titleText为计算属性的名称,计算属性中完成名称的判定
                 -->
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog
        :title=" '修改' + titleText "
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <!-- 
                    因为对话框被动态参数和静态属性共用,所以label的值不能写死
                    因此label="" -> :label="titleText"(变为动态绑定的方式)
                        其中titleText为计算属性的名称,计算属性中完成名称的判定
                 -->
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            cateList: [],
            // 级联选择框的配置对象
            cateProps: {
                // 选择的值
                value: 'cat_id',
                // 看到的值
                label: 'cat_name',
                // 父子之间的嵌套属性
                children: 'children'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys: [],
            // 被激活的页签的名称(默认选择第一个页签激活)
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态参数的数据
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },
            // 修改表单的验证规则对象
            editFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 修改的表单数据对象
            editForm: {
                attr_name: ''
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有的商品分类列表
        async getCateList() {
            const {data: res} = await this.$http.get(`categories`)
            if(res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败")
            }   

            // 把后端获取到的商品分类数据保存到数据对象中
            this.cateList = res.data
        },
        // 级联选择框中的选项发生了变化,会触发这个函数
        handleChange() {
            // 调用获取参数的方法
            this.getParamsData()
        },
        // Tab页签点击事件的处理函数
        handleTabClick() {
            // 调用获取参数的方法
            this.getParamsData()
        },
        // 获取参数的列表数据
        async getParamsData() {
            // 如果选中的不是3级分类
            if(this.selectedCateKeys.length !== 3) {
                // 清空数组,无法让非3级分类被选中
                this.selectedCateKeys = []
                // 清空表格中的数据,防止用户选择2级项目的时候,页面中还有表格显示(这样容易导致用户误操作)
                this.manyTableData = []
                this.onlyTableData = []
                return
            }

            // 根据所选分类的ID和当前所处的面板获取对应的参数
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: {sel: this.activeName}
            })
            if(res.meta.status !== 200) {
                return this.$message.error("获取参数列表失败!")
            }
            
            res.data.forEach(item => {
                // 把后端返回的字符串以空格为基础分隔成为数组
                // 三元表达式,如果item.attr_vals不为空就进行分隔成为数组,如果为空就返回一个空数组
                item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []

                // 保证每一行数据都有自己的数据和布尔值,防止行和行之间的数据联动
                // 控制文本框的显示与隐藏
                item.inputVisible = false
                // 文本框中输入的值
                item.inputValue = ''
            })

            // 在数据赋予之前先判断数据到底属于哪个表格,然后把数据挂载到相应的表格上
            // 如果当前点击的标签名称为many的话
            if(this.activeName === 'many') {
                // 就把后端获取到的数据赋予manyTableData数据对象
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }

        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            // 重置表单中的数据
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮,添加参数
        addParams() { 
            // 进行表单数据的欲验证
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return

                // 验证通过则发送网络请求
                const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res.meta.status !== 201) {
                    return this.$message.error("添加参数失败");
                }

                this.$message.success("添加参数成功!");
                // 关闭对话框
                this.addDialogVisible = false
                // 刷新数据列表
                this.getParamsData()
            })
        },
        // 点击按钮,展示修改的对话框
        async showEditDialog(attr_id) {
            // 发送请求,获取修改对象的数据
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
                params: {attr_sel: this.activeName}
            })
            if(res.meta.status !== 200) {
                return this.$message.error("获取参数信息失败!")
            }
            // 将获取到的信息保存到编辑对象中
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 重置修改的表单
        editDialogClosed() {
            // 清空表单
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮,修改参数信息
        editParams() {
            // 先进行表单的预校验
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return

                // 预校验通过,发送请求 this.cateId是计算属性
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res.meta.status !== 200) {
                    return this.$message.error("修改参数失败!")
                }

                this.$message.success("修改参数成功!")
                // 刷新数据列表
                this.getParamsData()
                // 隐藏对话框
                this.editDialogVisible = false
            })
        },
        // 根据id删除对应的参数项目
        async removeParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // 说明用户取消了删除操作
            if(confirmResult != 'confirm') {
                return this.$message.info("已经取消删除!")
            }

            // 删除的业务逻辑
            const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status !== 200) {
                return this.$message.error("删除参数失败!")
            }

            this.$message.success("参数删除成功!")
            // 刷新页面
            this.getParamsData()
        },
        // 文本框失去焦点或者按下了Enter键都会触发该函数
        async handleInputConfirm(row) {
            // 如果用户输入的都是空字符串
            if(row.inputValue.trim().length === 0) {
                // 将用户输入的内容重置为空
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            
            // 将用户输入的内容添加到对象中
            row.attr_vals.push(row.inputValue.trim())
            // 添加完成之后,原本输入的内容就没有用了,现在就清除
            row.inputValue = ''
            // 隐藏文本输入框,显示按钮
            row.inputVisible = false

            // 调用将attr_vals的操作保存到数据库的方法
            this.saveAttrVals(row)
        },
        // 将对attr_vals的操作保存到数据库
        async saveAttrVals(row) {
            // 将用户输入的数据更新到后端
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                // 将数组中的元素以空格分隔变成数组
                attr_vals: row.attr_vals.join(" ")
            })

            if(res.meta.status !== 200) {
                return this.$message.error("修改参数项失败!")
            }

            this.$message.success("修改参数项成功!")
        },
        // 点击按钮,展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // 让文本输入框自动获得焦点
            // $nextTick() 当页面上的元素被重新渲染之后,才会指定回调函数中的代码
            // 当我们执行 row.inputVisible = true 之后,浏览器会对文本输入框进行渲染让其展示
            // 但是渲染会花费时间,如果我们在渲染还没完成之前就获取焦点会出现找不到input输入框的情况
            // 因此我们才需要把获取焦点的代码放到 $nextTick之中
            this.$nextTick(_ => {
                // 获取到input输入框的DOM对象添加获取焦点事件 .focus()
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除对应的参数可选项
        handleClose(index, row) {
            // 根据index指定数组中的元素,从其中删除我们指定的那个元素
            row.attr_vals.splice(index, 1)
            // 调用将attr_vals的操作保存到数据库的方法
            this.saveAttrVals(row)
        }
    },
    // 计算属性
    computed: {
        // 如果按钮需要被禁用则返回true,否则就返回false
        isBtnDisabled() {
            // 如果级联选择器数据对象的长度不是3,说明用户没有选择第三级对象
            if(this.selectedCateKeys.length !== 3) {
                return true;
            }

            return false;
        },
        // 当前选中的三级分类的ID
        cateId() {
            // 如果级联选择框数据对象的长度为3的话,说明我们选中了第三级别
            if(this.selectedCateKeys.length === 3) {
                // 返回第三级别的id
                return this.selectedCateKeys[2];
            }

            return null;
        },
        // 动态的计算对话框标题的文本
        titleText() {

            if(this.activeName == 'many') {
                return "动态参数";
            }

            return "静态属性";
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 150px;
}
</style>