<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 
                订单列表数据
                border stripe 添加边框和隔行变色效果
             -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1' ">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <!-- 通过作用域插槽,决定显示的形式 -->
                    <template slot-scope="scope">
                        <!-- dataFormat 是我们在main.js中定义的全局过滤器 -->
                        {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <!-- 
                        :options="cityData" 指定级联选择器的数据源
                     -->
                    <el-cascader :options="cityData" v-model="addressForm.address1">

                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// 导入省市区/县的数据
import cityData from './citydata.js'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10,
            },
            // 订单总条数
            total: 0,
            // 订单数据列表
            orderList: [],
            // 控制修改地址对话框的显示与否
            addressVisible: false,
            // 表单的地址数据对象
            addressForm: {
                // 因为地址1对应的组件是级联选择器,所以应该是一个数组
                address1: [],
                address2: ''
            },
            // 校验对象
            addressFormRules: {
                address1: [
                    { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },
            // 省市区/县数据对象
            cityData: cityData
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        // 获取订单列表
        async getOrderList() {
            const {data: res} = await this.$http.get(`orders`, {
                params: this.queryInfo
            })
            if(res.meta.status !== 200) {
                return this.$message.error("获取订单列表失败!")
            }

            // 把返回的数据绑定到数据对象中
            this.total = res.data.total
            this.orderList = res.data.goods
        },
        // 每页显示条数发生改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 当前页码发生改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showBox() {
            this.addressVisible = true
        },
        // 监听对话框的关闭事件
        addressDialogClosed() {
            // 关闭对话框时,清空表单中的数据对象的数据
            this.$refs.addressFormRef.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>