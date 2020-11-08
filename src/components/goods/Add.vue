<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- :closable="false" 将警告区域设置为不可删除的状态 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false" />

            <!-- 
                步骤条区域
                :align-center="true" 步骤条区域字体居中显示
                :active="0" 用来控制激活项的索引(第一项索引为0,第二项索引为1)
                    activeIndex - 0 把字符串转换为数值
             -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" :align-center="true">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 
                Tab栏中有很多个面板,多个面板共同组成一个商品信息对象因此我们把Tab栏包裹在Form表单中
                label-position="top" 指定label在文本框之上
             -->
            <el-form :model="addForm" :rules="addFormRules" 
            ref="addFormRef" label-width="100px" label-position="top">
                <!-- 
                    Tab栏区域
                    :tab-position=" 'left' " 
                        控制Tab栏的位置,我们指定为永远在左侧
                    Tab面板中我们点击的是第一个面板,就会把第一个面板中的name属性对应的值(0),赋值到v-model绑定的数据对象中
                        由于Tab栏和步骤条使用的都是同一个数据对象,因此当切换Tab栏的时候,步骤条也会进行相应的改变
                 -->
                <el-tabs v-model="activeIndex" :tab-position=" 'left' " style="height: 200px;">
                    <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 步骤条被激活的索引(默认为0)
            activeIndex: 0,
            // 添加商品的表单数据对象
            addForm: {},
            // 表单的校验对象
            addFormRules: {

            }
        }
    },
    created() {

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
</style>