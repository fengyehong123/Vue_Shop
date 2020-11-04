<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加一个按钮,按钮最好独占一行 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleList" :border="true" :stripe="true">
                <!-- type="expand" 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 
                            通过栅格系统进行布局
                            i1 === 0 ? 'bdtop' : '' 采用三元表达式的方式添加类名
                                如果index为0的话(第一个元素),就添加上边框线样式
                        -->
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 占5份 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <!-- 添加一个小图标 -->
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 占19份 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '': 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <!-- 添加一个小图标 -->
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- 
                                            closable 为tag标签添加可以删除的小图标
                                            close 关闭 Tag 时触发的事件
                                        -->
                                        <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="i3" closable @close="removeRightById(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <!-- 因为操作列需要用到作用域插槽,所以prop属性可以不用指定 -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- size="mini" 可通过size属性来指定按钮的大小 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%">
            <!-- 
                树形控件
                :data="树形控件的数据源"
                :props="配置选项"
                show-checkbox 展示复选框
                node-key="id" 当我们选中该复选框的时候,指定选中的是id值(也可以修改为选中的是其他的属性)
                default-expand-all 展开所有的节点
            -->
            <el-tree 
            :data="rightsList" 
            :props="treeProps" 
            show-checkbox
            node-key="id"
            default-expand-all></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            roleList: [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限的数据
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                // 指定节点标签为节点对象的某个属性值
                label: 'authName',
                // 指定子树为节点对象的某个属性值
                children: 'children'
            }
        }
    },
    // 声明周期函数
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取所有角色的列表
        async getRolesList() {
            const {data: res} = await this.$http.get("roles")
            if(res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败")
            }

            this.roleList = res.data

            console.log(this.roleList);
        },
        // 根据id删除对应的权限
        async removeRightById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if(confirmResult !== 'confirm') {
                return this.$message.info("权限删除已取消")
            }

            // 用户确认删除数据的话,就发起网络请求(删除某个角色id对应的权限)
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200) {
                return this.$message.error("删除权限失败")
            }

            // 如果直接加载整个表格的数据的话,会重新进行渲染.原本打开的表格会再一次关闭上
            // this.getRolesList()

            // 我们直接把从后端返回的最新权限直接赋值给当前角色,让其重新渲染,这样可以避免表格关闭,提升用户体验
            role.children = res.data
        },
        // 展示分配权限的对话框
        async showSetRightDialog() {
            // 获取所有权限的数据
            const {data: res} = await this.$http.get(`rights/tree`)
            if(res.meta.status !== 200) {
                return this.$message.error("获取权限失败")
            }
            // 把后端获取的数据赋值给数据对象
            this.rightsList = res.data
            // 让对话框可以进行展示
            this.setRightDialogVisible = true
        }
    }
}
</script>

<style lang="less" scoped>
// 每一个tag标签之间都有间隙
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}
// 每一行下面的底部边框线
.bdbottom {
    border-bottom: 1px solid #eee;
}
// 纵向上的居中对齐
.vcenter {
    display: flex;
    align-items: center;
}
</style>