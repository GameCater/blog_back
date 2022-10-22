<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要视图 -->
    <el-card class="main_view">
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column prop="tagID" label="标签">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.tagID" :key="index">{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <img :src="scope.row.cover" style="height:4rem;" />
          </template>
        </el-table-column>
        <el-table-column prop="date" label="更新日期"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/articles/edit/${scope.row._id}`)"
            >编辑</el-button>
            <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: [],
      pageInfo: {
        page: 1,
        pageSize: 3
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.crumb {
  margin: 8px 6px;
}

.main_view {
  box-shadow: none;
}
</style>