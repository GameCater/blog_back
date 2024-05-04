<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ id ? '编辑' : '新增' }}用户</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card :body-style="{ padding: '30px' }" class="main_view">
            <!-- 表单部分 -->
            <el-form ref="form" label-width="80px" :model="users">
                <el-form-item label="用户名">
                    <el-input v-model="users.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <!-- 密码后端已隐藏处理 -->
                    <el-input type="password" v-model="users.password" placeholder="如需设置请覆盖"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="users.nickname"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="users.email"></el-input>
                </el-form-item>
                <el-form-item label="头像" style="position: relative;">
                    <el-avatar shape="square" :size="40" :src="users.avatar" icon="el-icon-user-solid">
                    </el-avatar>
                    <el-upload :headers="uploadHeaders" class="avatar-uploader" name="files"
                        :action="$http.defaults.baseURL + '/upload'" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <!-- <el-form-item label="管理员">
                    <el-radio v-model="users.isAdmin" :label="true">是</el-radio>
                    <el-radio v-model="users.isAdmin" :label="false">否</el-radio>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="save" class="btn-save">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            users: {
                username: '',
                password: '',
                nickname: '',
                email: '',
                avatar: '',
            },
            uploadHeaders: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    methods: {
        async getUser() {
            const { code, message, payload } = await this.$http.GET(`/rest/users/${this.id}`);
            if (code == 200) {
                for (let key in this.users) {
                    if (this.users.hasOwnProperty(key)) {
                        if (key !== 'password')
                            this.users[key] = payload.data.users[0][key];
                        else
                            this.users[key] = '';
                    }
                }
            }
        },
        // 提交
        async save() {
            if (this.id) {
                // 编辑用户
                //  const res = await this.$http.PUT(`/rest/users/${this.id}`, this.users); 
                //  if (res) {
                //   this.$message({
                //     type: 'success',
                //     message: '修改成功'
                //   });
                //   // 如果当前登录管理员的密码修改了
                //   if (this.users.password && this.$store.state.USER_INFO._id === this.id) {
                //     localStorage.clear();
                //     this.$store.commit('SWITCH_STATE');
                //     this.$router.replace('/login');
                //   }
                //   this.$router.replace('/home/users');
                //  }
                //  else {
                //   this.$message({
                //     type: 'error',
                //     message: '修改失败'
                //   })
                //  }
            } else {
                // 添加用户
                const { code } = await this.$http.POST('/rest/users', this.users);
                if (code == 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    });
                    this.$router.replace('/home/users');
                }
                else {
                    this.$message({
                        type: 'error',
                        message: '新增失败'
                    })
                }
            }
        },
        handleAvatarSuccess(res, file) {
            console.log(res);
            // this.users.avatar = res.url.replace('/public', '');
        },
        // 对上传头像的一些限制
        beforeAvatarUpload(file) {
            const isJPGOrPNG = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPGOrPNG) {
                this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPGOrPNG && isLt2M;
        }
    },
    mounted() {
        this.getUser();
    },
    beforeDestroy() {
        this.$refs['form'].resetFields();
    }
}
</script>

<style lang="scss">
.el-radio__input.is-checked {
    .el-radio__inner {
        background-color: #4b89ac;
        border-color: #4b89ac;
    }
}

.el-radio__label {
    color: #4b89ac !important;
}

.avatar-uploader {
    position: absolute;
    top: 0;
    left: 8px;

    color: white;
    font-size: 1.2rem;
    font-weight: bold;
}
</style>

<style lang="scss" scoped>
.btn-save {
    background-color: #4b89ac;
    border: none;
}

.crumb {
    margin: 8px 6px;
}

.main_view {
    box-shadow: none;

    .el-form {
        margin: 0 auto;
        width: 500px;

        .el-form-item:last-child {
            text-align: center;
        }
    }
}
</style>