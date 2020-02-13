<template>
  <div class="page-article" v-if="model">
    <div class="d-flex border-bottom">
      <i class="iconfont icon-back py-3 px-2 text-blue fs-xl"></i>
      <strong class="flex-1 py-3 text-blue">{{model.title}}</strong>
      <p class="text-gray fs-sm pr-2">{{model.createdAt|date}}</p>
    </div>
    <div v-html="model.body" class="px-3 article-body fs-lg"></div>
    <div class="link-container px-3 border-top py-3">
      <div class="link-title d-flex ai-center">
        <i class="iconfont icon-lianjie"></i>
        <strong class="text-blue fs-lg ml-2">相关资讯</strong>
      </div>
      <div class="link-item mt-2 fs-lg">
          <router-link class="py-2" tag="div" :to="`/articles/${item._id}`" v-for="item in model.related" :key="item._id">
              {{item.title}}
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null
    };
  },
  watch:{
      id:'fetch'
  },
  props: {
    id: {
      required: true
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    }
  },
  filters: {
    date(val) {
      if (!val) return;
      val = val.slice(0, 10);
      return val;
    }
  },
  created() {
    this.fetch();
  }
};
</script>

<style lang="scss">
.article-body {
  img {
    max-width: 100%;
    height: auto;
  }

  iframe {
    width: 100%;
    height: auto;
  }
}
</style>