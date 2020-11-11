<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 为echarts准备一个DOM元素 -->
            <div id="main" style="width: 750px; height:400px"></div>
        </el-card>
    </div>
</template>

<script>
// 导入echarts
import echarts from 'echarts'
// 导入lodash对象(为了合并对象使用)
import _ from 'lodash'

export default {
    data() {
        return {
            // 需要合并的数据
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    // 生命周期函数,一进页面就执行(此时页面上的元素还没有渲染完毕)
    created() {

    },
    // 生命周期函数,此时页面上的元素已经被渲染完毕了
    async mounted() {
        // 基于准备好的dom,初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 获取报表相关的数据
        const {data: res} = await this.$http.get('reports/type/1');
        if(res.meta.status !== 200) {
            return this.$message.error("获取折线图数据失败!")
        }

        // 准备数据和配置项
        // 使用lodash来合并两个数据对象(服务器返回的数据和我们自己准备的options数据对象)
        const result = _.merge(res.data, this.options)

        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(result);
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>

</style>