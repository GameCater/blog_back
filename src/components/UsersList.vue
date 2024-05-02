<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要视图 -->
    <el-card class="main_view">
      <!-- 表格 -->
      <el-table :data="users" stripe>
        <el-table-column prop="_id" label="ID" width="240"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="avatar" label="头像">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px; border: 3px solid #eee; border-radius: .2em;"
              :src="scope.row.avatar">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="isAdmin" label="是否管理员">
          <template  slot-scope="scope">
            <el-switch 
              v-model="scope.row.isAdmin" 
              active-color="#4b89ac" 
              inactive-color="#ccc"
              disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              class="update_btn"
              size="small"
              @click="$router.push(`/home/users/edit/${scope.row._id}`)"
            >编辑</el-button>
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
        v-if="users?.length"
        class="pagination"
        background
        :pager-count="9"
        :page-size="pageInfo.pageSize"
        layout="prev, pager, next"
        :total="count"
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
      users: [],
      pageInfo: {
        page: 1,
        pageSize: 3,
      },
      count: 0,
      showPopover: false,
    }
  },
  watch: {
    pageInfo: {
      deep: true,
      handler(newVal, oldVal) {
        this.getUsers();
      }
    }
  },
  methods: {
    async getUsers() {
      const { data, count } = await this.$http.GET(`/rest/users?page=${this.pageInfo.page}&pageSize=${this.pageInfo.pageSize}`);

      console.log(data);
      
      this.users = data;
      this.count = count;
    },
    handleCurrentChange(newPage) {
      this.pageInfo.page = newPage;
    },
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
    },
    async remove(id) {
      // await this.$http.DELETE(`/rest/users/${id}`);
      this.getUsers();
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style lang="scss">
// 覆盖分页默认样式
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