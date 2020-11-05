<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 
                搜索与添加区域
                使用elementUI的栅格系统来完成元素布局
                :gutter="20" 栅格和栅格之间的间隙
            -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 
                        搜索与添加区域
                        clearable: 文本框中的内容可清除
                        @clear="事件名称" 当清空文本框的内容时,触发我们自定义的事件名称
                     -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <!-- 点击查询按钮,进行数据检索 -->
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <!-- 当我们点击添加用户按钮的时候,让对话框属性设置为true,显示对话框 -->
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 
                用户列表区域
                :data="userList" 给表格组件绑定的数据源
                border 给表格添加边框线
                stripe 表格添加斑马纹效果
            -->
            <el-table :data="userList" border stripe>
                <!-- 表格的索引列 -->
                <el-table-column type="index"></el-table-column>
                <!-- 
                    label="姓名" 表头
                    prop="username" 绑定的数据属性名
                -->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <!-- 
                    后端返回的状态值是 true 或者 false
                    我们需要根据状态来显示开关的状态
                    因此需要通过作用域插槽来渲染了状态这一列
                    
                    在状态列中定义了作用域插槽
                    通过slot-scope接收了作用域的数据
                    scope.row 获取的是表格中这一整行的数据

                    如果我们同时指定了作用域插槽和prop属性,那么作用域插槽会覆盖掉prop属性
                -->
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <!-- 
                            scope.row.mg_state 把状态值动态绑定到开关组件上
                            @change="" 当开关状态改变的时候,触发我们自定义的函数
                                userStateChanged(scope.row) 我们直接把这一行的数据传递到我们自定义的函数
                        -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <!-- width="180px" 手动指定表格列的宽度 -->
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 scope.row.id 把这一行用户所对应的id值传到函数中 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 
                            信息提示框
                            effect="dark" 提示框的颜色
                            content="分配角色" 提示框的消息内容
                            placement="top-start" 提示框出现的位置
                            :enterable="false" 鼠标是否可以进入提示框(鼠标离开,提示框自动隐藏)
                        -->
                        <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <!-- 分配角色按钮 -->
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 
                分页区域
                layout="" 用来指定页面上显示哪些分页组件
             -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

            <!-- 
                添加用户的对话框
                title 对话框的标题
                :visible.sync 对话框的显示与隐藏
                width 对话框的宽度
                :before-close=""  对话框关闭之前触发一个事件
                @close="addDialogClosed" 关闭对话框时触发的事件
            -->
            <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
                <!-- 内容主体区域 ref="addFormRef" 代表整个表单对象 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <!-- 把用户输入的信息绑定到addForm中 -->
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 对话框的的底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <!-- 当我们点击取消按钮的时候,让对话框不可见 -->
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 
                修改用户的对话框
            -->
            <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
                <!-- 内容主体区域 ref="editFormRef" 代表整个表单对象 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <!-- 
                            把用户输入的信息绑定到editForm中 
                            disabled: 用户名这一栏是禁用的
                            因为用户名这一栏是禁用的,所以没有校验规则,所以没有添加prop属性
                        -->
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 对话框的的底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <!-- 当我们点击取消按钮的时候,让对话框不可见 -->
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色的对话框 -->
            <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed"
            >
                <div>
                    <p>当前用户:{{userInfo.username}}</p>
                    <p>当前角色:{{userInfo.role_name}}</p>
                    <p>
                        分配新角色:
                        <!-- 
                            el-select: elementUI中提供的下拉框组件
                                v-model="selectRoleId" 当前选中的对象
                                v-for="item in roleList" 需要遍历的对象
                         -->
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        /*
            验证邮箱的规则
            参数1: 校验的规则
            参数2: 要校验的值
            参数3: 回调函数
        */
        let checkEmail = (rules, value, callback) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

            // 如果通过校验
            if (regEmail.test(value)) {
                return callback()
            }
            
            // 如果通不过校验,就返回提示信息
            callback(new Error('请输入合法的邮箱'))
        }
        // 校验手机号的规则
        let checkMobile = (rules, value, callback) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }

            callback(new Error('请输入合法的手机号'))
        }

        // 数据对象
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 用户进行搜索时的搜索关键字
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 2
            },
            userList: [],
            // 一共有多少条数据
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            //  添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                eamil: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码的长度在6~15个字符之间', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    // validator代表使用自定义的校验规则
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 控制角色分配对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    // validator代表使用自定义的校验规则
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 需要被分配角色的用户信息
            userInfo: {},
            // 所有角色的数据列表
            roleList: [],
            // 已经选中的角色的Id值
            selectedRoleId: '',
        }
    },
    created() {
        // 钩子函数,一进页面就发送获取用户列表的请求
        this.getUserList()
    },
    methods: {
        async getUserList() {

            const {data: res} = await this.$http.get('users', { params: this.queryInfo })
            if(res.meta.status !== 200) {
                return this.$message.error("获取用户列表失败!")
            }
            // 把获取到的数据赋值到数据对象中
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            // 当页码改变的时候,重新向后端发送ajax请求来获取最新的数据
            this.getUserList();
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList();
        },
        // 监听switch开关状态的改变
        async userStateChanged(userInfo) {
            // 当开关的状态改变的时候,发送ajax请求
            const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status !== 200) {
                // 因为更新数据到后端失败,所以把前端按钮的状态给还原
                userInfo.mg_status = !userInfo.mg_status;
                return this.$message.error("更新用户状态失败!");
            }

            this.$message.success("更新用户状态成功!");
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            // 清空整个表单对象
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮添加新用户
        addUser() {
            // 获取整个表单对象
            // validate 用来对整个表单对象进行验证,如果通过了所有的校验规则,则返回true
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) {
                    return;
                }

                // 如果验证通过,就可以发送添加用户的网络请求
                const {data: res} = await this.$http.post("users", this.addForm)
                if(res.meta.status !== 201) {
                    this.$message.error("添加用户失败!");
                }

                this.$message.success("添加用户成功!");
                // 隐藏对话框
                this.addDialogVisible = false;
                // 重新获取用户列表的数据
                this.getUserList();
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get(`/users/${id}`);
            if(res.meta.status !== 200) {
                this.$message.error("查询用户信息失败!");
            }

            // 把查询到的用户数据赋值到数据对象中
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听用户对话框的关闭事件
        editDialogClosed() {
            // 清空对表单的修改
            this.$refs.editFormRef.resetFields();
        },
        // 修改用户信息并提交
        editUserInfo() {
            // 进行表单数据预校验
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) {
                    return;
                }
                
                // 发起修改用户信息的网络请求
                const {data: res} = await this.$http.put(`users/${this.editForm.id}`, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })

                if(res.meta.status !== 200) {
                    return this.$message.error("更新用户信息失败!");
                }

                // 关闭对话框
                this.editDialogVisible = false;

                // 更新列表的数据
                this.getUserList();

                // 提示用户更新成功
                this.$message.success("更新用户信息成功");
            })
        },
        // 根据id值删除对应的用户信息
        async removeUserById(id) {
            // 弹窗询问用户是否要删除数据
            // .catch(err => err) 捕获用户的取消行为
            const confirmResult = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?', 
                '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(err => err)

            // 如果用户确认删除,则返回的字符串为 confirm
            // 如果用户取消了删除,则返回的字符串为 cancel
            if(confirmResult !== 'confirm') {
                return this.$message.info("已经取消删除")
            }

            // 发送删除用户的请求
            const {data: res} = await this.$http.delete(`users/${id}`)

            if(res.meta.status !== 200) {
                return this.$message.error("删除用户失败!")
            }

            this.$message.error("删除用户成功!")

            // 刷新列表
            this.getUserList();
        },
        // 展示分配角色的对话框
        async setRole(userInfo) {
            // 把用户信息保存到用户对象中
            this.userInfo = userInfo

            // 在展示对话框之前获取所有角色的列表
            const {data: res} = await this.$http.get("roles")
            if(res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败!")
            }

            // 把获取到的角色信息保存到角色对象中
            this.roleList = res.data

            // 展示对话框
            this.setRoleDialogVisible = true
        },
        // 点击按钮,分配角色
        async saveRoleInfo() {
            // 如果用户没有选择新角色的话
            if(!this.selectedRoleId) {
                return this.$message.error("请选择要分配的角色!")
            }

            // 发起网络请求,给用户添加角色
            const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
                rid: this.selectedRoleId
            })

            if(res.meta.status !== 200) {
                return this.$message.error("更新角色失败!")
            }

            this.$message.success("更新角色成功!")
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed() {
            // 重置所选择的角色id和用户信息
            this.selectedRoleId = ''
            this.userInfo = {}
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>