<template>
  <div>
    <!-- <h3>当前最新的count的值为:{{count}}</h3> -->
    <h3>{{showNum}}</h3>
    <button @click="btnHandler1">-1</button>
    <button @click="btnHandler2">-N</button>
    <!-- 
      直接把从vuex中解构出的函数放到@click中点击使用
     -->
    <button @click="subAsync">-1 Async</button>
    <button @click="subNAsync(5)">-N Async</button>
  </div>
</template>

<script>
// 从vuex中按需导入mapState函数
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      
    }
  },
  computed: {
      // 将全局属性映射为当前组件的计算属性 
      ...mapState(['count']),
      // 解构出getters方法
      ...mapGetters(['showNum'])
  },
  methods: {
    // 从vuex中获取到sub函数,解构到此处
    ...mapMutations(['sub', 'subN']),
    // 从vuex中获取到异步的subAsync函数,解构到此处
    ...mapActions(['subAsync', 'subNAsync']),
    btnHandler1() {
      // 当我们点击按钮的时候,调用从vuex中获取到的sub()函数
      this.sub()
    },
    btnHandler2() {
      // 向vuex中的方法传递参数
      this.subN(3)
    }
  },
}
</script>