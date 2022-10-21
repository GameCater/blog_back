<template>
    <el-container class="home_container">
      <el-aside style="width: 280px;">
        <!-- 系统logo -->
        <div class="home_logo">
          <h1>博客管理系统</h1>
        </div>
        
        <!-- 导航菜单 -->
          <el-menu 
            style="border-right: none; background-color: #f8f8f8;"
            router
            :default-active="$route.path"
            unique-opened>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>数据统计
              </template>
              <el-menu-item index="/home">
                <template slot="title">
                  <i class="el-icon-document"></i>统计面板
                </template>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>文章管理
              </template>
              <el-menu-item index="/home/articles/create">
                <template slot="title">
                  <i class="el-icon-document"></i>新建文章
                </template>
              </el-menu-item>
              <el-menu-item index="/home/articles/list">
                <template slot="title">
                  <i class="el-icon-tickets"></i>文章列表
                </template>
              </el-menu-item>
              <el-menu-item index="/home/tags/create">
                <template slot="title">
                  <i class="el-icon-document"></i>新建标签
                </template>
              </el-menu-item>
              <el-menu-item index="/home/tags/list">
                <template slot="title">
                  <i class="el-icon-tickets"></i>标签列表
                </template>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>评论管理
              </template>
              <el-menu-item index="/home/comments/list">
                <template slot="title">
                  <i class="el-icon-tickets"></i>文章评论
                </template>
              </el-menu-item>
              <el-menu-item index="/home/messages/list">
                <template slot="title">
                  <i class="el-icon-tickets"></i>留言
                </template>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>文件管理
              </template>
              <el-menu-item index="/home/photos/add">
                <template slot="title">
                  <i class="el-icon-tickets"></i>上传图片
                </template>
              </el-menu-item>
              <el-menu-item index="/home/photos/list">
                <template slot="title">
                  <i class="el-icon-tickets"></i>图片列表
                </template>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-menu"></i>用户管理
              </template>
              <el-menu-item index="/home/users/list">
                <template slot="title">
                  <i class="el-icon-tickets"></i>用户列表
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>

      <el-container>
        <!-- 管理系统头部 提供退出、设置等操作 -->
        <el-header 
          style="height: 80px;"
          class="home_head">
          <!-- 折叠栏 -->
          <!-- <span class="fold_btn" @click="toggleCollapse">
            <i :class="fold_class"></i>
          </span> -->

          <!-- 头部功能区 -->
          <div class="header_tools_box">
            <!-- 设置 -->
            <div class="tool_settings">
              <!-- el-icon-s-tools -->
              <i class="el-icon-s-tools"></i>
            </div>
            <!-- 管理员信息展示区 -->
            <div class="admin_box">
              <!-- el-icon-user-solid -->
              <el-popover
                placement="bottom"
                width="150"
                trigger="click"
                popper-class="admin_info_box">
                <div class="admin_info">
                  <el-image
                    class="avatar_box"
                    style="width: 80px; height: 80px; border-radius: 50%;">
                  </el-image>
                  <ul class="admin_info_btn_list">
                    <li><el-button type="text" @click="logout">退出</el-button></li>
                  </ul>
                </div>
                <i class="el-icon-user-solid" slot="reference"></i>
              </el-popover>
            </div>
            <!-- 消息通知 -->
            <div class="tool_notice">
              <!-- el-icon-message-solid -->
              <i class="el-icon-message-solid"></i>
            </div>
          </div>
        </el-header>
        <!-- 内容展示区 -->
        <el-main>
          <!-- 二级导航出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      isCollapse: true,
      fold_class: 'el-icon-s-fold',
    }
  }, 
  methods: {
    ...mapMutations(['SWITCH_STATE']),
    // 暂存，折叠面板功能
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.fold_class = 'el-icon-s-fold';
      } else {
        this.fold_class = 'el-icon-s-unfold';
      }
    },
    logout() {
      // 注销用户登录
      this.SWITCH_STATE();
      // 删除token记录
      localStorage.clear()
      this.$router.replace('/login');
    }
  }
}
</script>

<style lang="scss">
  .admin_info_box {
    // 不奏效
    padding: 10px 0 0;

    .admin_info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .admin_info_btn_list {
        &::before {
          display: block;
          content: ' ';
          border: 1px solid #eee;
          width: 100%;
          margin: 0 auto;
        }
        width: 100%;
        text-align: center;
        list-style-type: none;
        padding: 0;
        margin: 5px 0 0;
        font-size: .9rem;
        li {
          cursor: pointer;
          span {
            color: black;
            font-size: 0.8rem;
          }
          &:hover {
            background-color: #eee;
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .home_container {
    height: 100vh;
    background-color: #e4fcf9;

    .el-aside {
      background-color: #f8f8f8;
      .home_logo {
        overflow: hidden;
        height: 80px;
        background-color: #4b89ac;
        font-family: 'Courier New', Courier, monospace;
        text-align: center;
        line-height: 40px;
        color: #e4fcf9;
      }
    }

    .el-header {
      background-color: #4b89ac;
      box-shadow: 6px 0 1px #446491;
      line-height: 80px;
      .fold_btn {
        color: white;
        font-size: 1.2rem;
      }
      .header_tools_box {
        margin-right: 20px;
        display: flex;
        flex-direction: row-reverse;
        gap: 25px;
        font-size: 1.2rem;
        color: #f8f8f8;
      }
    }

    .el-main {
      background-color: #fff;
    }
  }
</style>