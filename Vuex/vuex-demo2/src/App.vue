<template>
  <div id="app">
    <a-input placeholder="请输入任务" class="my_ipt" 
    :value="inputValue" @change="handleInputChange" />
    <a-button type="primary" @click="addItemToList">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <!-- 
          @change="(e) => {cbStatusChanged(e)}"
            通过箭头函数的方式来调用函数, e带包checkbox对象
         -->
        <a-checkbox :checked="item.done" @change="(e) => {cbStatusChanged(e, item.id)}">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{unDoneLength}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <!-- 
            根据viewKey的值,通过三元表达式的方式来判断type的值,从而决定按钮的样式
           -->
          <a-button :type="viewKey === 'all' ? 'primary' : '' " @click="changList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary' : '' " @click="changList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' : '' " @click="changList('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  data() {
    return { }
  },
  // 声明周期函数,一进页面就调用里面的方法
  created() {
    // .dispatch()方法专门用来触发actions中的方法
    this.$store.dispatch('getList')
  },
  // 计算属性
  computed: {
    // 把vuex中的数据对象获取解构到此处
    ...mapState(['inputValue', 'viewKey']),
    // 把Vuex中getters中方法解构到此处
    ...mapGetters(['unDoneLength', 'infoList'])
  },
  methods: {
    // 监听文本框内容变化
    handleInputChange(e) {
      // 将文本框输入的值保存到store中
      this.$store.commit('setInputValue', e.target.value)
    },
    // 向列表中新增item项
    addItemToList() {
      if(this.inputValue.trim().length <= 0) {
        return this.$message.warning('文本框内容不能为空!')
      }

      // 调用mutations中的方法,新增一个Item
      this.$store.commit('addItem')
    },
    // 根据id删除对应的任务项
    removeItemById(id) {
      this.$store.commit('removeItem', id)
    },
    // 监听复选框选中状态变化的事件
    cbStatusChanged(e, id) {
      // 通过e.target.checked可以接收到复选框的最新的选中状态
      const param = {
        id: id,
        status: e.target.checked
      }

      // 通过触发mutations中的方法修改复选框的选中状态
      this.$store.commit('changeStatus', param)
    },
    // 清除已完成的任务
    clean() {
      // 通过触发mutation中的方法来清除已经完成的任务
      this.$store.commit('cleanDone')
    },
    // 修改页面上展示的列表数据
    changList(key) {
      this.$store.commit('changeViewKey', key)
    }
  },
}
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

