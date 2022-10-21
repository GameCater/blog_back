<template>
  <div class="not_found">
    <h1>404 NOT FOUND</h1>
    <h3 @click="back">返回</h3>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
  h1, h3 {
    text-align: center;
    color: #2f4f4f;
  }
  h3 {
    cursor: pointer;
  }
</style>