<template>
  <div id="app">
    <!-- 一级路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    console.log('App created');
    // 刷新页面初始化Vuex
    if (sessionStorage.user) {
      this.$store.commit('SWITCH_STATE', Object.assign({}, JSON.parse(sessionStorage.getItem('user'))));
    } else {
      this.$store.dispatch('GET_CURRENT_ADMIN');
    }
  }
}
</script>

<style lang="scss">
  @import url('@/assets/styles/global.scss');
</style>
