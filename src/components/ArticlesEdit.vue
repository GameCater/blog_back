<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/home/articles' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ id ? '编辑' : '新增' }}文章</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card :body-style="{ padding: '30px' }" class="main_view">
            <!-- 表单部分 -->
            <el-form ref="form" label-width="120px" :model="article">
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
                        <el-select v-model="tagSelected" multiple value-key="key">
                            <el-option v-for="item in tagsList" :key="item._id" :label="item.name"
                                :value="item._id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 文件导入 -->
                    <el-form-item label="导入md文件">
                        <el-upload ref="upload" name="files" :data="{ action: 'importMarkdown' }" multiple action="#"
                            :on-success="afterUpload" :on-error="handleUploadError" :headers="authorization"
                            :before-upload="beforeUpload" :on-remove="onFileRemove" :on-change="onFileChange"
                            :auto-upload="false" :file-list="form.fileList">
                            <el-button size="small" type="primary" class="btn" @click="onUploadClick">导入</el-button>
                        </el-upload>
                    </el-form-item>
                </div>
                <!-- Markdown 编写-->
                <mavon-editor :tabSize="2" :boxShadow="false" v-model="article.markdown" ref="md" @imgAdd="$imgAdd"
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
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
export default {
    props: ['id'],
    data() {
        return {
            article: {},
            tagSelected: [],
            tagsList: [],
            authorization: {
                Authorization: 'Bearer ' + localStorage.token
            },
            imgFiles: {},
            form: {
                fileList: []
            }
        }
    },
    methods: {
        onUploadClick() {
            this.form.fileList = [];
            this.$nextTick(() => {
                this.$refs.upload.$children[0].$refs.input.webkitdirectory = true;
            })
        },
        onFileRemove(file, fileList, name) {
            let idx = this.form.fileList.indexOf(file);
            this.form.fileList.splice(idx, 1);
        },
        async onFileChange(file, fileList, name) {
            this.form.fileList.push(file);
            let total = this.$refs.upload.$refs["upload-inner"].$refs.input.files.length;
            let isAllUploaded = this.form.fileList.length === total;
            if (isAllUploaded) {
                // 过滤掉非法文件
                let files = this.form.fileList;
                let mdFile;
                let imageFiles = [];
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    let type = file.name.split('.')[1];
                    let isMd = type === "md";
                    let isImage = file.raw.type?.indexOf("image/") != -1;
                    if (isMd) {
                        mdFile = file.raw;
                    }
                    else if (isImage) {
                        imageFiles.push(file.raw);
                    }
                }
                // 判断必要文件是否存在
                if (!mdFile) {
                    this.$message({
                        type: "error",
                        message: "必须上传markdown文件！"
                    })
                    return;
                }

                // 先上传图片
                let serverFiles;
                if (imageFiles.length) {
                    serverFiles = await this.uploadImagesForImportedMarkdown(imageFiles);
                }

                // 处理markdown内容
                let md = await mdFile.text();
                if (md) {
                    // 替换所有本地图片地址为服务器图片地址
                    const updatedContent = md.replace(/\!\[(.*?)\]\((.*?)\)/g, (match, altText, imagePath) => {
                        let targetFile = serverFiles.find(file => file.originalname === imagePath);
                        let serverPath = imagePath;
                        if (targetFile) {
                            serverPath = targetFile.serverPath;
                        }
                        return `![${altText}](${serverPath})`;
                    });

                    this.article.markdown = updatedContent;
                }
            }
        },
        beforeUpload(file, fileList) {
            return false;
        },
        async fetchArticle() {
            const { code, payload, message } = await this.$http.GET(`/rest/articles/${this.id}`);
            if (code == 200) {
                this.article = payload.data;
                this.tagSelected = this.article.tags.map(tag => tag._id);
            }
            else {
                this.$message({
                    type: "error",
                    message: message
                })
            }
        },
        afterUpload(res, file) {

        },
        handleUploadError(err, file) {
            // console.log(err);
        },
        $imgAdd(pos, file) {
            this.imgFiles[pos] = file;
        },
        $imgDel(pos, file) {
            delete this.imgFiles[pos];
        },
        async uploadImagesForImportedMarkdown(files) {
            let formData = new FormData();
            let extraInfoArr = [];
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                formData.append("files", file);

                let uuid = uuidv4();
                let extraInfo = {
                    uuid,
                    index: i
                };
                file.ext = extraInfo;
                extraInfoArr.push(extraInfo);
            }
            formData.append("ext", JSON.stringify(extraInfoArr));
            formData.append("action", "saveImageFromMarkdown");

            const response = await this.$http.POST_FORM_MULTI("/upload", formData);
            if (response.code == 200) {
                const files = response.payload.data;
                return files;
            }
            return [];
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
                formData.append("action", "saveImageFromMarkdown");

                const response = await this.$http.POST_FORM_MULTI("/upload", formData);
                if (response.code == 200) {
                    const files = response.payload.data;
                    for (let i = 0; i < files.length; i++) {
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
            const tags = this.tagSelected;
            this.article = Object.assign(this.article, { modifiedTime, markdown, html, click, author, tags });

            let res;
            if (this.id) {
                // 如果是修改文章
                res = await this.$http.PUT(`/rest/articles/${this.id}`, this.article);
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