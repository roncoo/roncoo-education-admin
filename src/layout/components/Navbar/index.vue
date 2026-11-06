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
    background-color: var(--admin-surface);
    border-bottom: 1px solid var(--admin-line);
    box-shadow: 0 1px 8px rgba(23, 43, 77, 0.04);
  }
</style>
