<template>
  <div class="logo">
    <img src="@/assets/images/logo.png" alt="logo" />
  </div>
</template>
<script setup></script>

<style lang="scss" scoped>
  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #15213e;
    // 保持与左侧主菜单 100px 的视觉对齐；全局 border-box 下需要包含原有内边距。
    width: 100px;
    height: 60px;
    vertical-align: top;
    z-index: 99;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.08);

    img {
      height: 40px;
      width: auto;
    }
  }
</style>
