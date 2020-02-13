<template>
  <div class="card bg-white mt-3">
    <div class="card-header d-flex ai-center" :class="[{'noBorderBottom':!noBorderBottom},{'py-3':!noBorderBottom}]">
      <i class="iconfont" :class="`icon-${leftIconName}`" v-if="`${leftIconName}`"></i>
      <div class="flex-1 ai-center px-2 fs-xl"><strong>{{title}}</strong></div>
      <div v-if="$slots.right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="card-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftIconName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    noBorderBottom:{
      type:Boolean
    }
  }
};
</script>

<style lang="scss">
@import "./src/assets/scss/variables";
.card {
  border-bottom: 1px solid $border-color;

  .card-header {
    position: relative;
  }

  .noBorderBottom.card-header::after {
    content: "";
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: map-get($map: $colors, $key: "light-one");
    transform: scaleY(0.5);
  }
}
</style>