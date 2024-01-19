<template>
  <el-header>
    <logo/>
    <breadcrumb/>
    <links/>
  </el-header>
</template>
<script setup lang="ts">
import Logo from './Logo.vue'
import Breadcrumb from './Breadcrumb.vue'
import Links from './Links.vue'
</script>

<style lang="less" scoped>
.el-header {
  position: fixed;
  padding: 0;
  width: 100%;
  z-index: 1999;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}
</style>
