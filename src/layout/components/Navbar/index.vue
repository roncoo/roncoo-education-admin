<template>
  <el-header>
    <logo />
    <breadcrumb />
    <user />
  </el-header>
</template>
<script setup>
  import Logo from './Logo.vue'
  import Breadcrumb from './Breadcrumb.vue'
  import User from './User.vue'
</script>

<style lang="scss" scoped>
  .el-header {
    position: fixed;
    padding: 0;
    width: 100%;
    z-index: 99;
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
  }
</style>
