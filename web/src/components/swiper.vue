<template>
  <swiper :options="swiperOption">
    <slot></slot>
    <div
      class="swiper-pagination"
      :class="[`${paginationName}-pagination`,`text-${position}`,`${addPadding}`]"
      v-if="pagination"
      slot="pagination"
    ></div>
  </swiper>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper } from "vue-awesome-swiper";
export default {
  name: "MeSlider",
  components: {
    swiper
  },
  props: {
    pagination: {
      type: Boolean,
      default: true
    },
    paginationName: {
      type: String
    },
    position: {
      type: String,
      default: "right"
    },
    addPadding: {
      type: String
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.swiperOption = {
        pagination: {
          el:
            this.pagination && this.paginationName
              ? `.${this.paginationName}-pagination`
              : ".swiper-pagination"
        },
        autoHeight:true
      };
    }
  }
};
</script>