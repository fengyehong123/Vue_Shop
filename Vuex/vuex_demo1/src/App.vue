<template>
  <div>
    <!-- 使用我们导入的组件 -->
    <my-addition></my-addition>
    <p>-----------------------</p>
    <my-subtraction></my-subtraction>
  </div>
</template>

<script>
// 导入我们自定义的组件
import Addition from './components/Addition.vue'
import Subtraction from './components/Subtraction.vue'

export default {
  data() {
    return {
      
    }
  },
  // 将我们导入的组件注册为App的子组件
  components: {
    'my-addition': Addition,
    'my-subtraction': Subtraction
  }
}
</script>