<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/home/articles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{id ? '编辑' : '新增'}}文章</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card :body-style="{ padding: '30px' }" class="main_view">
      <!-- 表单部分 -->
      <el-form ref="form" label-width="80px" :model="tags">
        <el-form-item label="标签名称">
          <el-input v-model="tags.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" class="btn">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  props: ['id'],
  data() {
    return {
      tags: {}
    }
  },
  methods: {
    async save() {
      this.tags.date = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
      
      let res;
      if (this.id) {
        this.$http.PUT(`/rest/tags/${this.id}`, this.tags);
      } else {
        this.$http.POST('/rest/tags', this.tags);
      }
      this.$message({
        type: 'success',
        message: this.id ? '更新成功' : '新增成功'
      })

      this.$router.replace('/home/tags');
    },
    beforeDestroy() {
      this.$refs['form'].resetFields();
    },
  },
}
</script>


<style lang="scss">
.el-form {
  .form_up {
    width: 800px;
  }
}
</style>

<style lang="scss" scoped>
.btn {
  background-color: #4b89ac;
  border: none;
}
.crumb {
  margin: 8px 6px;
}

.main_view {
  box-shadow: none;
}
</style>
