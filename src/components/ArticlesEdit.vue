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
      <el-form ref="form" label-width="80px" :model="article">
        <div class="form_up">
          <!-- 标题 -->
          <el-form-item label="文章标题">
            <el-input v-model="article.title"></el-input>
          </el-form-item>
          <!-- 简介 -->
          <el-form-item label="文章简介">
            <el-input v-model="article.desc"></el-input>
          </el-form-item>
          <!-- 标签选择 -->
          <el-form-item label="所含标签">
            <el-select v-model="article.tags" multiple>
              <el-option
                v-for="item in tagsList"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 封面上传 -->
          <!-- <el-form-item label="上传封面">
            <el-upload 
              :action="$http.defaults.baseURL + '/upload'" 
              :on-success="afterUpload"
              :on-error="handleUploadError"
              :headers="authorization">
              <el-button size="small" type="primary" class="btn">点击上传</el-button>
            </el-upload>
          </el-form-item> -->
        </div>
        <!-- Markdown 编写-->
        <mavon-editor
          :tabSize="2"
          :boxShadow="false"
          v-model="article.markdown" 
          ref="md" 
          @imgAdd="$imgAdd" 
          @imgDel="$imgDel">
        </mavon-editor>
        <!-- 保存 -->
        <el-form-item>
          <el-button type="primary" @click="save" class="btn btn-save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { v4 as uuidv4 } from "uuid";
export default {
  props: ['id'],
  data() {
    return {
      article: {},
      authorization: {
        Authorization: 'Bearer ' + localStorage.token
      },
      tagsList: [],
      imgFiles: {},
    }
  },
  methods: {
    async fetchArticle() {
      const { code, payload, message } = await this.$http.GET(`/rest/articles/${this.id}`);
      if (code == 200) {
        this.article = payload.data[0];
      }
      else {
        this.$message({
          type: "error",
          message: message
        })
      }
    },
    // afterUpload(res, file) {
    //   if (file.status === 'success') {
    //     this.$set(this.article, 'cover', res.url.replace('/public','')); // 给article新增cover属性
    //     this.$message({
    //       type: 'success',
    //       message: '文章封面上传成功',
    //     });
    //   }
    // },
    // handleUploadError(err, file) {
    //   console.log(err);
    // },
    $imgAdd(pos, file) {
      this.imgFiles[pos] = file;
    },
    $imgDel(pos, file) {
      delete this.imgFiles[pos];
    },
    async upload() {
      if (this.imgFiles && Object.keys(this.imgFiles).length) {
        let formData = new FormData();
        let extraInfoArr = [];
        for (let key in this.imgFiles) {
          let file = this.imgFiles[key];
          formData.append("files", file);

          let uuid = uuidv4();
          let extraInfo = { 
            uuid,
            index: key
          };
          file.ext = extraInfo;
          extraInfoArr.push(extraInfo);
        }
        formData.append("ext", JSON.stringify(extraInfoArr));

        const response = await this.$http.POST_FORM_MULTI("/upload", formData);
        if (response.code == 200) {
          const files = response.payload.data;
          for (let i = 0; i < files.length; i ++) {
            let file = files[i];
            this.$refs.md.$img2Url(file.ext.index, file.serverPath);
          }
        }
      }
	  },
    async save() {
      await this.upload();

      const modifiedTime = Date.now();
      const markdown = this.$refs.md.d_value;
      const html = this.$refs.md.d_render;
      const click = this.id ? this.article.click : 0;
      const author = this.$store.state.USER_INFO._id;
      this.article = Object.assign(this.article, { modifiedTime, markdown, html, click, author });

      let res;
      if (this.id) {
        // 如果是修改文章
        res= await this.$http.PUT(`/rest/articles/${this.id}`, this.article);
      } else {
        // 新增文章
        res = await this.$http.POST('/rest/articles', this.article);
      }
      if (res) {
        this.$message({
          type: 'success',
          message: this.id ? '修改成功' : '新增成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: '出错'
        })
      }
      // 返回首页
      this.$router.replace('/home/articles');
	  },
    async fetchTags() {
      const response = await this.$http.GET('/rest/tags');
      this.tagsList = response.payload.data;
    }
  },
  created() {
    this.fetchTags();
    this.id && this.fetchArticle();
  },
  mounted() {
    // console.log(this.$refs.md); 
  },
  beforeDestroy() {
    this.$refs['form'].resetFields();
  }
}
</script>

<style lang="scss">
.el-form {
  .form_up {
    width: 800px;
  }
  .el-form-item__content {
    text-align: left
  }
}
</style>

<style lang="scss" scoped>
.btn {
  background-color: #4b89ac;
  border: none;
}
.btn-save {
  float: right;
  margin-top: 20px;
}
.crumb {
  margin: 8px 6px;
}

.main_view {
  box-shadow: none;
  .el-form {
    margin: 0 auto;
    min-width: 1200px;
    .el-form-item:last-child {
      text-align: center;
    }
  }
}
</style>