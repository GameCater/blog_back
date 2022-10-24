<template>
  <div class="login">
    <div class="container">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" style="width: 120px;">
      </div>
      <!-- 表单区域 -->
      <el-form
        class="login_form"
        :model="loginForm" 
        ref="loginForm" 
        hide-required-asterisk>
        <!-- 用户名 -->
        <el-form-item 
          prop="username"
          :rules="[
            { required: true, message: '用户名不能为空' }
          ]">
          <el-input 
            type="text" 
            v-model.trim="loginForm.username" 
            autocomplete="off"
            placeholder="用户名"
            >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item 
          prop="password"
          :rules="[
            { required: true, message: '密码不能为空' }
          ]">
          <el-input 
            type="password" 
            v-model.trim="loginForm.password" 
            autocomplete="off"
            placeholder="密码"
            >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button 
            class="login_btn"
            @click="submitForm('loginForm')">登录
          </el-button>
          <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
    }
  },
  methods: {
    ...mapMutations(['SWITCH_STATE']),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 登录请求
          const data = await this.$http.POST('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          });
          const { status, token, message, data: user } = data;
          if (status) {
            // 本地存储token
            localStorage.setItem('token', token);
            // 会话存储存储用户信息
            sessionStorage.setItem('user', JSON.stringify(user));
            // 状态机全局存储用户信息以及登录状态，内存存储，加快读取速度
            this.SWITCH_STATE(user);
            // 跳转主页
            this.$router.replace('/home');
          } else {
            this.$message({
              message,
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '验证不通过',
            type: 'error'
          })
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    background: #00d2ff;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #3a7bd5, #00d2ff);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #3a7bd5, #00d2ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    overflow: hidden;

    .container {
      margin: calc(50vh - 144px) auto;
      background-color: white;
      height: 280px;
      width: 400px;
      border: 4px solid whitesmoke;
      border-radius: .3em;
      opacity: 1;

      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      position: relative;

      .avatar_box {
        position: absolute;
        top: -70px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 5px solid whitesmoke;
        background-color: white;
        overflow: hidden;
      }

      .login_form {
        margin-top: 50px;
        width: 60%;
        & .el-form-item:last-child {
          margin-bottom: 0;
        }

        .login_btn {
          width: 100%;
          background: linear-gradient(to left, #3a7bd5, #00d2ff);
          color: #eee;
          font-size: .9rem;
          text-align: center;
          font-weight: bold;
          letter-spacing: .2em;
        }
      }
    }
  }
</style>