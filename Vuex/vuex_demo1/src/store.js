import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个vuex实例
const vuexObj = new Vuex.Store({
  state: {
    count: 0
  },
  // 只有mutations中定义的函数,才有权利修改state中的数据
  mutations: {
    // 参数state代表全局的数据对象
    add(state) {

      // 不能在mutations函数中执行异步操作,会不起作用
      // 准备延时一秒后执行
      /*
        setTimeout(() => {
          state.count++
        }, 1000)
      */

      state.count++
    },
    addN(state, step) {
      state.count += step
    },
    sub(state) {
      state.count--
    },
    subN(state, step) {
      state.count -= step
    }
  },
  actions: {
    // 我们定义一个异步函数addAsync
    // context 相当于new出来的vuex实例对象
    addAsync(context) {
      setTimeout(() => {
        // 把add()方法包裹在异步操作的代码中,从而实现在Action中触发mutations中的方法
        // 在action中,不能直接修改state中的数据,必须通过context.commit()触发某个mutation才可以
        context.commit('add')
      }, 1000)
    },
    // 异步传递参数
    addNAsync(context, step) {
      setTimeout(() => {
        context.commit('addN', step)
      }, 1000)
    },
    subAsync(context) {
      setTimeout(() => {
        context.commit('sub')
      }, 1000)
    },
    subNAsync(context, step) {
      setTimeout(() => {
        context.commit('subN', step)
      }, 1000)
    }
  },
  getters: {
    showNum(state) {
      return `当前最新的数量是:${state.count}`
    }
  }
})

// 把实例对象给暴露出去
export default vuexObj
