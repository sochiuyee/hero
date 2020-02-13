<template>
  <div>
    <h1>{{id?'编辑':'新建'}}广告位</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-button size="small" @click="model.items.push({})" style="margin-left:80px">添加广告位</el-button>
      <el-form-item>
        <el-row type="flex" style="flex-wrap:wrap">
          <el-col :md="24" v-for="(item,index) in model.items" :key="index" style="margin-bottom:20px">
            <el-form-item label="跳转链接">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top:20px">
              <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL+'/upload'"
                :show-file-list="false"
                :on-success="res=>$set(item,'image',res.url)"
              >
                <img v-if="item.image" :src="item.image" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-button type="danger" icon="el-icon-delete" style="margin-left:120px" size="small"></el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
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
      model: {
        items: []
      }
    };
  },

  methods: {
    async save() {
      let res;
      if (this.id) {
        // 编辑
        res = await this.$http.put(`rest/ads/${this.id}`, this.model);
      } else {
        // 新建
        res = await this.$http.post("rest/ads", this.model);
      }
      this.$message({
        message: "保存成功",
        type: "success"
      });

      // 跳转到分类列表页
      this.$router.push("/ads/list");
    },

    async fetch() {
      const res = await this.$http.get(`rest/ads/${this.id}`);
      this.model = Object.assign({}, res.data); // 直接赋值会覆盖掉model的items属性导致添加广告位出错
    }
  },

  created() {
    this.id && this.fetch();
  }
};
</script>

<style scoped>
@import '../css/avatar.css';
.avatar-uploader .avatar-uploader-icon {
    width: 10rem;
    height: 5rem;
    line-height: 5rem;
  }
  .avatar {
    width: 10rem;
    height: 5rem;
  }
</style>
