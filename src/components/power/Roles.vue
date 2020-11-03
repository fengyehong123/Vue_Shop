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
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 占5份 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <!-- 添加一个小图标 -->
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 占19份 -->
                            <el-col :span="19">

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
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            roleList: [],
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
</style>