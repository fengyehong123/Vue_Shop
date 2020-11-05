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
        width="50%"
        @close="setRightDialogClosed">
            <!-- 
                树形控件
                :data="树形控件的数据源"
                :props="配置选项"
                show-checkbox 展示复选框
                node-key="id" 当我们选中该复选框的时候,指定选中的是id值(也可以修改为选中的是其他的属性)
                default-expand-all 展开所有的节点
                :default-checked-keys="树形控件默认选中的对象"
                ref="treeRef" 树形组件的引用,可以通过这个对象获取整个树形组件的对象
            -->
            <el-tree 
            :data="rightsList" 
            :props="treeProps" 
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defKeys"
            ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
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
            },
            // 默认选中的节点id值数组
            defKeys: [],
            // 当前即将分配权限的角色id
            roleId: '',
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
        async showSetRightDialog(role) {
            // 将角色的id保存到role对象中
            this.roleId = role.id
            // 获取所有权限的数据
            const {data: res} = await this.$http.get(`rights/tree`)
            if(res.meta.status !== 200) {
                return this.$message.error("获取权限失败")
            }
            // 把后端获取的数据赋值给数据对象
            this.rightsList = res.data

            // 递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys)  

            // 让对话框可以进行展示
            this.setRightDialogVisible = true
        },
        // 通过递归的形式,获取角色下所有三级权限的id,并且保存到defKey是数组中
        getLeafKeys(node, arr) {
            // 如果当前的node节点不包含children属性,则是三级节点
            if(!node.children) {
                return arr.push(node.id)
            }

            // 如果当前节点包含children属性,那么就通过递归的方式进一步调用
            node.children.forEach(item => {
                // 通过递归的方式进一步进行查询
                return this.getLeafKeys(item, arr)
            })
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            // 当我们关闭权限分配对话框的时候,需要把加载到数据对象中的数据清空
            // 防止其他对象的权限分配对话框打开的时候,加载到我们上一次加载的数据
            this.defKeys = []
        },
        // 点击为角色分配权限
        async allotRights() {
            // 获取树形组件中全选和半选状态下的id
            const keys = [
                /*
                    ... 为js的展开运算符,主要用来进行数组合并
                    var array1 = [1, 2, 3];
                    var array2 = [4, 5, 6];
                    var array3 = [...array1, ...array2, 7, 8];  // [1,2,3,4,5,6,7,8]
                    或者
                    array1.push(...array2 )  // [1,2,3,4,5,6,7,8]
                */
                // 若节点可被选择(即show-checkbox为true),则返回目前被选中的节点的key所组成的数组
                // getCheckedKeys()是树形组件所提供的方法,用来获取树形组件中获取到的节点
                ...this.$refs.treeRef.getCheckedKeys(),
                // 若节点可被选择(即show-checkbox为true),则返回目前半选中的节点的key所组成的数组
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]

            // 把数组转换为以逗号分隔的字符串
            const idStr = keys.join(',')

            // 发起网络请求,添加权限
            const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
            if(res.meta.status !== 200) {
                return this.$message.error("分配权限失败!")
            }

            this.$message.success("分配权限成功!");

            // 刷新数据列表
            this.getRolesList()

            // 隐藏整个对话框
            this.setRightDialogVisible = false
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