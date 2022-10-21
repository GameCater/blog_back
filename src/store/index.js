import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 已登录管理员信息
    USER_INFO: null,
    // 是否在线
    IS_ONLINE: false
  },
  getters: {
  },
  mutations: {
    SWITCH_STATE(state, obj) {
      // 如果传值
      if (obj) {
        state.USER_INFO = obj;
        state.IS_ONLINE = true;
      } else {
        state.USER_INFO = null;
        state.IS_ONLINE = false;
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
