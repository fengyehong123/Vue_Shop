import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 任务列表的数据对象 
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // 新添加的项目id
    nextId: 5,
    // 默认展示所有的数据
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      // 把外部传入的list赋值给state中的list数据对象
      state.list = list
    },
    // 为store中的inputValue赋值
    setInputValue(state, value) {
      state.inputValue = value
    },
    // 添加列表项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      
      // 将新增加的数据对象保存到list数据对象中
      state.list.push(obj)
      // 添加完成之后id自增并且清空输入框对象中的数据
      state.nextId++
      state.inputValue = ''
    },
    // 根据id删除对应的任务事项
    removeItem(state, id) {
      // 根据ID查找对应的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引,删除对应的元素
      // 若i的值为-1,则说明没有list数据对象中没有对应的数据
      if(i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus(state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      // 判断要查找的元素是否存在
      if(i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 清除已经完成的任务
    cleanDone(state) {
      state.list = state.list.filter(item => item.done === false)
    },
    // 修改视图的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      // 使用axios发起异步请求,获取当前项目中list.json中存储的数据
      axios.get('/list.json').then(({data}) => {
        // 把获取到的data传递到mutations中
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength(state) {
      // 把数组中未完成的数据给过滤出来
      let unDoneList = state.list.filter(x => x.done === false)
      return unDoneList.length;
    },
    //
    infoList(state) {
      if(state.viewKey === 'all') {
        // 获取出全部的任务
        return state.list;
      }

      if(state.viewKey === 'undone') {
        // 过滤出全部未完成的任务
        return state.list.filter(x => x.done === false)
      }

      if(state.viewKey === 'done') {
        // 过滤出全部已完成的任务
        return state.list.filter(x => x.done === true)
      }

      return state.list;
    }
  }
})
