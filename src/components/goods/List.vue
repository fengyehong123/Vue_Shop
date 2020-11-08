<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 
                使用栅格系统添加一行
                :gutter="20" 栅格系统中列和列之间的距离
             -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 
                        :clearable="true" 给输入框添加清空的功能
                        @clear="getGoodsList" 当我们清空输入框中的文本时,会触发@clear中绑定的函数
                     -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getGoodsList">
                        <!-- 搜索框旁边的搜索按钮 -->
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table表格区域 -->
            <el-table :data="goodsList" border :stripe="true">
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <!-- 在作用域插槽中使用我们在main.js中定义的全局时间过滤器对时间进行格式化 -->
                    <template slot-scope="scope">
                        <!-- 使用全局时间过滤器对时间进行格式化 -->
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 
                分页区域
                :background="true" 给当前分页组件添加背景
             -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :background="true">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 一页显示的条数
                pagesize: 10
            },
            // 商品列表
            goodsList: [],
            // 总数据条数
            total: 0,
        }
    },
    // 生命周期函数,一进页面就加载
    created() {
        this.getGoodsList()
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodsList() {
            const {data: res} = await this.$http.get(`goods`, {
                params: this.queryInfo
            })
            if(res.meta.status !== 200) {
                return this.$message.error("获取商品列表失败!")
            }

            this.$message.success("获取商品列表成功!")
            // 将后端返回的数据保存到商品列表数据对象中
            this.goodsList = res.data.goods
            // 将数据总条数保存到数据对象中
            this.total = res.data.total
        },
        // 当前页码发生改变
        handleSizeChange(newSize) {
            // 把当前最新的页码赋值给查询对象中
            this.queryInfo.pagesize = newSize
            // 重新获取数据
            this.getGoodsList()
        },
        // 每页显示的条数发生改变
        handleCurrentChange(newPage) {
            // 把一页显示的条数赋值给查询对象中
            this.queryInfo.pagenum = newPage
            // 重新获取数据
            this.getGoodsList()
        },
        // 根据ID删除商品
        async removeById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm') {
                return this.$message.info("已经取消删除!")
            }

            // 发送请求,删除商品
            const {data: res} = await this.$http.delete(`goods/${id}`)
            if(res.meta.status !== 200) {
                return this.$message.error("商品删除失败!")
            }

            this.$message.success("商品删除成功!")
            // 刷新数据列表
            this.getGoodsList()
        },
        // 跳转到商品添加界面
        goAddPage() {
            // 通过this.$router路由导航对象的.push()方法跳转到指定的页面
            this.$router.push('/goods/add')
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>