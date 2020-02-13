<template>
  <!-- start top -->
  <div class="page-hero" v-if="model">
    <div class="topbar py-2 px-3 d-flex ai-center text-white">
      <img src="../assets/logo.png" height="32px" />
      <div class="px-2 flex-1">
        <span class="px-3">王者荣耀</span>
        <span>攻略站</span>
      </div>
      <router-link tag="span" to="/">更多英雄 &gt;</router-link>
    </div>
    <div class="top" :style="{'background-image':`url(${model.banner})`}">
      <div class="info text-white p-3 h-100 d-flex flex-column jc-end">
        <p class="fs-sm my-0">{{model.title}}</p>
        <h3 class="my-0 py-1">{{model.name}}</h3>
        <p class="my-0 fs-sm">{{model.categories.map(item=>item.name).join('/')}}</p>
        <div class="d-flex jc-between">
          <div class="scores d-flex ai-center" v-if="model.scores">
            <span>难度：</span>
            <span class="badge bg-primary">{{model.scores.difficult}}</span>
            <span>技能：</span>
            <span class="badge bg-blue">{{model.scores.skills}}</span>
            <span>攻击：</span>
            <span class="badge bg-danger">{{model.scores.attack}}</span>
            <span>生存：</span>
            <span class="badge bg-dark">{{model.scores.survive}}</span>
          </div>
          <router-link tag="span" to="/" class="text-gray fs-sm">皮肤：2 &gt;</router-link>
        </div>
      </div>
    </div>
    <!-- end of top -->

    <div>
      <div class="px-3 bg-white">
        <div class="nav d-flex jc-around pt-3 pb-2 border-bottom">
          <div class="nav-item active">
            <div class="nav-link">英雄初识</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">进阶攻略</div>
          </div>
        </div>
      </div>
      <me-swiper :pagination="false">
        <swiper-slide>
          <div>
            <div class="p-3 bg-white border-bottom">
              <div class="d-flex">
                <router-link tag="button" to="/" class="btn btn-lg flex-1">
                  <i class="iconfont icon-bofang"></i>
                  英雄介绍视频
                </router-link>
                <router-link tag="button" to="/" class="btn btn-lg flex-1 ml-2">
                  <i class="iconfont icon-tupian"></i>
                  一图识英雄
                </router-link>
              </div>

              <!-- skills -->
              <div class="skills bg-white mt-3">
                <!-- skills icons -->
                <div class="d-flex jc-around">
                  <img
                    class="icon"
                    :class="{active:currentSkillsIndex === index}"
                    @click="currentSkillsIndex = index"
                    :src="item.icon"
                    alt
                    v-for="(item,index) in model.skills"
                    :key="item.name"
                  />
                </div>

                <!-- skills details -->
                <div v-if="currentSkill">
                  <div class="d-flex pt-4 pb-3">
                    <h3 class="m-0">{{currentSkill.name}}</h3>
                    <span>（冷却值：{{currentSkill.delay}} 消耗值：{{currentSkill.cost}}）</span>
                  </div>
                  <p class="m-0">{{currentSkill.description}}</p>
                  <p class="border-top text-gray-one" v-if="currentSkill.tips">{{currentSkill.tips}}</p>
                </div>
              </div>
            </div>

            <me-card class="px-3 pt-3" leftIconName="gongju" title="出装推荐" noBorderBottom>
              <div class="equip pt-2" slot="body">
                <p class="fs-xl mb-2 mt-0">顺风出装</p>
                <div class="d-flex jc-around text-center border-bottom">
                  <div class="flex-1" v-for="(item,index) in model.items1" :key="index">
                    <img :src="item.icon" alt />
                    <p class="text-ellipsis fs-xs">{{item.name}}</p>
                  </div>
                </div>
                <p class="fs-xl mb-2">逆风出装</p>
                <div class="d-flex jc-around text-center">
                  <div class="flex-1" v-for="(item,index) in model.items2" :key="index">
                    <img :src="item.icon" alt />
                    <p class="text-ellipsis fs-xs">{{item.name}}</p>
                  </div>
                </div>
              </div>
            </me-card>

            <me-card class="px-3 pt-3" leftIconName="tishi" title="使用技巧" noBorderBottom>
              <div class="pb-3 pt-2" slot="body">
                <p class="m-0">{{model.usageTips}}</p>
              </div>
            </me-card>

            <me-card class="px-3 pt-3" leftIconName="cuo" title="对抗技巧" noBorderBottom>
              <div class="pb-3 pt-2" slot="body">
                <p class="m-0">{{model.battleTips}}</p>
              </div>
            </me-card>

            <me-card class="px-3 pt-3" leftIconName="29" title="团战思路" noBorderBottom>
              <div class="pb-3 pt-2" slot="body">
                <p class="m-0">{{model.teamTips}}</p>
              </div>
            </me-card>

            <me-card class="px-3 pt-3" leftIconName="futou" title="英雄关系" noBorderBottom>
              <div class="partners pt-2" slot="body">
                <p class="m-0 pb-2 fs-xl">最佳搭档</p>
                <div class="d-flex ai-center mb-3" v-for="item in model.partners" :key="item.name">
                  <img class="mr-2" :src="item.hero.avatar" alt />
                  <p class="m-0 flex-1">{{item.description}}</p>
                </div>
              </div>
            </me-card>
          </div>
        </swiper-slide>
      </me-swiper>
    </div>
  </div>
</template>

<script>
import MeSwiper from "../components/swiper";
import { swiperSlide } from "vue-awesome-swiper";
import MeCard from "../components/card";
export default {
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      model: null,
      currentSkillsIndex: 0
    };
  },
  computed: {
    currentSkill() {
      return this.model.skills[this.currentSkillsIndex];
    }
  },
  components: {
    MeSwiper,
    swiperSlide,
    MeCard
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`heroes/${this.id}`);
      this.model = res.data;
    }
  },
  created() {
    this.fetch();
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";
.page-hero {
  .topbar {
    background: url("../../../images/sprite.png") no-repeat 0 87.195%;
  }

  .top {
    height: 50vw;
    background: #fff no-repeat top center;
    background-size: auto 100%;
  }

  .info {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  }

  .scores {
    .badge {
      margin: 0 0.25rem;
      display: inline-block;
      width: 1rem;
      height: 1rem;
      line-height: 0.95rem;
      text-align: center;
      border-radius: 50%;
      font-size: 0.6rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  .skills {
    img.icon {
      width: 4.6154rem;
      height: 4.6154rem;
      border: 3px solid map-get($map: $colors, $key: "white");
      &.active {
        border-color: map-get($map: $colors, $key: "primary");
      }
      border-radius: 45%;
    }
  }

  .equip {
    img {
      width: 3.5769rem;
      height: 3.5769rem;
      border-radius: 50%;
    }
  }

  .partners {
    img {
      width: 3.6923rem;
      height: 3.6923rem;
    }
  }
}
</style>