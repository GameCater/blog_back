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
        <el-table-column prop="tags" label="标签">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.tags" :key="index">{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px; border: 3px solid #eee; border-radius: .2em;"
              :src="scope.row.cover">
            </el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="modifiedTime" label="更新日期"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              class="update_btn"
              type="primary"
              size="small"
              @click="$router.push(`/home/articles/edit/${scope.row._id}`)"
            >编辑
            </el-button>
            <el-popover
              placement="top"
              width="160"
              :ref="`popover-${scope.$index}`">
              <p>确认删除此条记录？</p>
              <div style="text-align: right; margin: 0">
                <el-button 
                  size="mini" 
                  type="text"
                  @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消
                </el-button>
                <el-button 
                  type="primary" 
                  size="mini" 
                  @click="remove(scope.row._id); scope._self.$refs[`popover-${scope.$index}`].doClose()">确定
                </el-button>
              </div>
              <el-button 
                class="delete_btn" 
                type="danger" 
                size="small" 
                slot="reference">删除
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-if="count > 0"
        class="pagination"
        background
        :pager-count="9"
        :page-size="pageInfo.pageSize"
        :total="count"
        :current-page="pageInfo.page"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
      </el-pagination>
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
        pageSize: 20
      },
      count: 0
    }
  },
  watch: {
    pageInfo: {
      deep: true,
      handler(newVal, oldVal) {
        this.fetchAllArticles();
      }
    }
  },
  methods: {
    async fetchAllArticles() {
      const { code, payload, message } = await this.$http.GET(`/rest/articles?page=${this.pageInfo.page}&pageSize=${this.pageInfo.pageSize}`);
      if (code == 200) {
        this.articles = payload.data;
        this.count = payload.total;
      }
      else {
        this.$message({
          type: "error",
          message: message
        })
      }
    },
    async remove(id) {
      await this.$http.DELETE(`/rest/articles/${id}`);
      await this.fetchAllArticles();
      let targetPage = Math.ceil(this.count / this.pageInfo.pageSize);
      this.pageInfo.page = targetPage;
    },
    handleCurrentChange(newPage) {
      this.pageInfo.page = newPage;
    },
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
    }
  },
  mounted() {
    this.fetchAllArticles();
  }
}
</script>

<style lang="scss">
.pagination {
  margin-top: 10px;
  [type=button] {
    background: none !important;
  }
  .el-pager {
    li {
      border-radius: 50% !important;
    }
    .active {
      background-color: #4b89ac !important;
    }
  }
}
// 编辑按钮和删除按钮
.update_btn {
  background-color: #4b89ac;
  color: white;
  &:hover {
    background-color: #446491;
    color: white;
    border: 1px solid transparent;
  }
}
.delete_btn {
  background-color: #c94e4e;
  &:hover {
    background-color: #713045;
    border: 1px solid transparent;
  }
}
</style>

<style lang="scss" scoped>
.crumb {
  margin: 8px 6px;
}

.main_view {
  box-shadow: none;
}
</style>