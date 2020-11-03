<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 
                表格通过 :data 来绑定数据源
                :border="true" 给表格添加边框线
                :stripe="true" 表格各行变色
            -->
            <el-table :data="rightsList" :border="true" :stripe="true">
                <!-- 指定索引列 -->
                <el-table-column type="index"></el-table-column>
                <!-- 指定表头信息和表格数据 -->
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column type="路径" prop="path"></el-table-column>
                <el-table-column type="权限等级" prop="level">
                    <!-- 使用作用域插槽的方式会覆盖掉 prop="level" 属性-->
                    <template slot-scope="scope">
                        <!-- 通过v-if的方式来决定到底显示那个tag -->
                        <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1' ">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
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
            // 权限列表
            rightsList: []
        }
    },
    created() {
        // 获取所有的权限
        this.getRightsList()
    },
    methods: {
        // 获取权限列表
        async getRightsList() {
            const {data: res} = await this.$http.get(`rights/list`)
            if(res.meta.status !== 200) {
                return this.$message.error("获取权限列表失败!")
            }

            this.rightsList = res.data;

            console.log(this.rightsList)
        }
    }
}
</script>

<style lang="less" scoped>

</style>