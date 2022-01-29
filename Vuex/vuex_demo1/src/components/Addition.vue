<template>
  <div>
    <!-- 
      $store.state.count 
        获取state中的数据
     -->
    <!-- <h3>当前最新的count的值为:{{$store.state.count}}</h3> -->
    <h3>{{$store.getters.showNum}}</h3>
    <button @click="btnHandler1">+1</button>
    <button @click="btnHandler2">+N</button>
    <button @click="btnHandler3">+1 Async</button>
    <button @click="btnHandler4">+N Async</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    btnHandler1() {
      // 调用vuex中mutations里面的add方法使count值改变
      this.$store.commit('add')
    },
    btnHandler2() {
      // 调用的时候传递参数
      // commit()函数的作用就是调用某个mutation函数
      this.$store.commit('addN', 2)
    },
    // 异步的方式让count自增 +1
    btnHandler3() {
      // 触发actions的第一种方式
      // 这里的dispatch函数专门用来触发action
      this.$store.dispatch('addAsync')
    },
    btnHandler4() {
      this.$store.dispatch('addNAsync', 5)
    }
  },
}
</script>