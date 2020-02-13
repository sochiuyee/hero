<template>
  <div>
    <div class="topbar bg-black py-2 px-3 d-flex ai-center">
      <img src="../assets/logo.png" height="32px">
      <div class="px-2 flex-1">
        <h1 class="text-white fs-lg my-0">王者荣耀</h1>
        <p class="text-gray-one fs-xxs my-0">团队成就更多</p>
      </div>
      <button type="button" class="btn bg-primary">立即下载</button>
    </div>
    <div class="bg-primary pt-3 pb-2">
      <div class="nav nav-reverse jc-around pb-1">
        <div class="nav-item active">
          <router-link class="nav-link" tag="div" to="/">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" tag="div" to="/">攻略中心</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" tag="div" to="/">赛事中心</router-link>
        </div>
      </div>
    </div>
    <!-- 子路由放置的地方 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  
};
</script>

<style lang="scss">
.topbar{
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>


