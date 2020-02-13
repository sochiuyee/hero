<template>
  <me-card class="px-3" :leftIconName="leftIconName" :title="title">
    <i class="iconfont" :class="`icon-${rightIconName}`" slot="right" v-if="rightIconName"></i>
    <div slot="right" v-else></div>
    <div class="nav jc-between pt-3 pb-2" slot="body">
      <div
        class="nav-item"
        :class="{active:active===index}"
        v-for="(category,index) in categories"
        :key="index"
        @click="$refs.list.$children[0].swiper.slideTo(index)"
      >
        <div class="nav-link">{{category.name}}</div>
      </div>
    </div>

    <me-swiper slot="body" :pagination="false" ref="list">
      <swiper-slide v-for="(category,index) in categories" :key="index">
        <slot name="items" :category="category"></slot>
      </swiper-slide>
    </me-swiper>
  </me-card>
</template>

<script>
import MeCard from "../components/card";
import MeSwiper from "../components/swiper";
import { swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    MeCard,
    MeSwiper,
    swiperSlide
  },
  data() {
    return {
      active: 0
    };
  },
  props: {
    leftIconName: {
      type: String,
      required: true
    },
    rightIconName: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.$refs.list.$children[0].swiper.on('slideChange',this.changeActive)
  },
  methods:{
    changeActive(){
      this.active = this.$refs.list.$children[0].swiper.realIndex
    }
  },
  beforeDestory(){
    this.$refs.list.$children[0].swiper.off('slideChange',this.changeActive)
  }
};
</script>