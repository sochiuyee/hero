<template>
  <div>
    <!-- swiper start -->
    <me-swiper :pagination="true" paginationName="home" addPadding="px-3 pb-1">
      <swiper-slide>
        <img class="w-100" src="../../../images/swiper1.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../../../images/swiper2.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../../../images/swiper3.jpeg" alt />
      </swiper-slide>
    </me-swiper>
    <!-- swiper end -->

    <!-- nav start -->
    <div class="nav-icons bg-white mt-3 text-center pt-3 text-dark-one">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="(item,index) in navs" :key="index">
          <i class="sprite" :class="item.icon"></i>
          <div class="py-2">{{item.title}}</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm">
        <i class="sprite sprite-arrow mr-1"></i>
        <span>收起</span>
      </div>
    </div>
    <!-- nav end -->

    <me-list-card
      leftIconName="cc-menu-circle"
      title="新闻资讯"
      rightIconName="menu"
      :categories="newsCates"
    >
      <template #items="{category}">
        <router-link
          tag="div"
          :to="`/articles/${news._id}`"
          class="py-2 d-flex"
          v-for="(news,index) in category.newsList"
          :key="index"
        >
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{news.title}}</span>
          <span class="text-gray fs-sm">{{news.createdAt|date}}</span>
        </router-link>
      </template>
    </me-list-card>

    <me-list-card
      leftIconName="-superhero"
      title="英雄列表"
      rightIconName="menu"
      :categories="heroesCates"
    >
      <template #items="{category}">
        <div class="heroesContainer d-flex flex-wrap" style="margin:0 -0.5rem">
          <router-link tag="div" :to="`/heroes/${hero._id}`" class="p-2" v-for="(hero,index) in category.heroList" style="width:20%" :key="index">
            <img class="w-100" :src="hero.avatar" alt />
            <p class="text-center">{{hero.name}}</p>
          </router-link>
        </div>
      </template>
    </me-list-card>
  </div>
</template>

<script>
import MeSwiper from "../components/swiper";
import { swiperSlide } from "vue-awesome-swiper";
import MeListCard from "../components/listCard";
export default {
  components: {
    MeSwiper,
    swiperSlide,
    MeListCard
  },
  data() {
    return {
      newsCates: [],
      heroesCates: []
    };
  },
  methods: {
    async fetchNewsCates() {
      const res = await this.$http.get("news/list");
      this.newsCates = res.data;
    },

    async fetchHeroesCates() {
      const res = await this.$http.get("heroes/list");
      this.heroesCates = res.data;
    }
  },
  filters: {
    date(val) {
      if (!val) return;
      val = val.slice(5, 10).replace(/-/, "/");
      return val;
    }
  },
  created() {
    this.navs = [
      { title: "爆料站", icon: "sprite-news" },
      { title: "故事站", icon: "sprite-story" },
      { title: "周边商城", icon: "sprite-shop" },
      { title: "体验服", icon: "sprite-test" },
      { title: "新人专区", icon: "sprite-new-person" },
      { title: "荣耀·传承", icon: "sprite-honor" },
      { title: "模拟战资料库", icon: "sprite-simulation" },
      { title: "王者营地", icon: "sprite-camp" },
      { title: "公众号", icon: "sprite-public" },
      { title: "版本介绍", icon: "sprite-version" },
      { title: "对局环境", icon: "sprite-badge" },
      { title: "无限王者团", icon: "sprite-king" },
      { title: "创意互动营", icon: "sprite-creative" }
    ];

    this.fetchNewsCates();
    this.fetchHeroesCates();
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables";
.home-pagination {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background-color: map-get($colors, "white");
    &.swiper-pagination-bullet-active {
      background-color: map-get($colors, "info");
    }
  }
}

.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    &:not(:nth-child(4n)) {
      border-right: 1px solid $border-color;
    }
  }
}
</style>
