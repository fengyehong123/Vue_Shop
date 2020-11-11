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
                        <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
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

        <!-- 展示物流进度的对话框 -->
        <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
            <!-- Timeline时间线组件 -->
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
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
            cityData: cityData,
            // 物流进度的对话框展示与否
            progressVisible: false,
            // 物流数据对象
            progressInfo: [
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ],

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
        },
        // 展示物流进度信息
        async showProgressBox() {
            // 让对话框显示
            this.progressVisible = true
        }
    }
}
</script>

<style lang="less" scoped>
// 收到导入时间线组件的样式
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader {
    width: 100%;
}
</style>