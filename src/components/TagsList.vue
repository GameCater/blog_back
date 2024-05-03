<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="main_view">
      <!-- 表格 -->
      <el-table :data="tags">
        <el-table-column prop="_id" label="ID" width="240"></el-table-column>
        <el-table-column prop="name" label="标签名称"></el-table-column>
        <el-table-column prop="desc" label="标签描述"></el-table-column>
        <el-table-column prop="modifiedTime" label="更新日期"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              class="update_btn"
              type="primary"
              size="small"
              @click="$router.push(`/home/tags/edit/${scope.row._id}`)"
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
      tags: [],
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
        this.fetchTags();
      }
    }
  },
  methods: {
    handleCurrentChange(newPage) {
      this.pageInfo.page = newPage;
    },
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
    },
    async fetchTags() {
      const { code, message, payload } = await this.$http.GET(`/rest/tags?page=${this.pageInfo.page}&pageSize=${this.pageInfo.pageSize}`);
      if (code == 200) {
        this.tags = payload.data;
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
      await this.$http.DELETE(`/rest/tags/${id}`);
      await this.fetchTags();
      let targetPage = Math.ceil(this.count / this.pageInfo.pageSize);
      this.pageInfo.page = targetPage;
    }
  },
  mounted() {
    this.fetchTags();
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