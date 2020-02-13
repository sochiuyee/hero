<template>
  <div>
    <h1>{{id?'编辑':'新建'}}文章</h1>
    <!-- 在 <el-form> 标签上添加 @submit.native.prevent阻止默认行为 -->
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属文章">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor v-model="model.body" useCustomImageHandler @image-added="handleImageAdded"></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  props: {
    id: {}
  },

  data() {
    return {
      model: {},
      categories: []
    };
  },

  components: {
    VueEditor
  },

  methods: {
    async save() {
      let res;
      if (this.id) {
        // 编辑
        res = await this.$http.put(`rest/articles/${this.id}`, this.model);
      } else {
        // 新建
        res = await this.$http.post("rest/articles", this.model);
      }
      this.$message({
        message: "保存成功",
        type: "success"
      });

      // 跳转到分类列表页
      this.$router.push("/articles/list");
    },

    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
    },

    async fetchCategories() {
      const res = await this.$http.get("rest/categories");
      this.categories = res.data;
    },

    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    }
  },

  created() {
    this.fetchCategories();
    this.id && this.fetch();
  }
};
</script>
