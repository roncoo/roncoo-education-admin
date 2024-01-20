<template>
  <el-container>
    <navbar/>
    <el-container class="container">
      <sidebar/>
      <mains/>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import Navbar from './components/Navbar/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import Mains from './components/Mains.vue'
</script>
<style lang="less">
.container {
  margin-top: 50px;
}
</style>