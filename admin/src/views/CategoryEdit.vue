<template>
  <div>
    <h1>{{id?'编辑':'新建'}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },

  data() {
    return {
      model: {}, // 用户输入的内容，使用v-model进行双向绑定
      parents: []
    };
  },

  methods: {
    async save() {
      let res;
      if (this.id) {
        // 编辑
        res = await this.$http.put(`rest/categories/${this.id}`, this.model);
      } else {
        // 新建
        res = await this.$http.post("rest/categories", this.model);
      }
      this.$message({
        message: "保存成功",
        type: "success"
      });

      // 跳转到分类列表页
      this.$router.push("/categories/list");
    },

    async fetch() {
      const res = await this.$http.get(`rest/categories/${this.id}`);
      this.model = res.data;
    },

    async fetchParents() {
      const res = await this.$http.get("rest/categories");
      this.parents = res.data;
    }
  },

  created() {
    this.fetchParents();
    this.id && this.fetch();
  }
};
</script>
