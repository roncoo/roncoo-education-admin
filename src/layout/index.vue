<template>
  <el-container>
    <navbar/>
    <el-scrollbar>
      <el-container class="container">
        <sidebar/>
        <mains/>
      </el-container>
    </el-scrollbar>
  </el-container>
</template>
<script setup lang="ts">
import Navbar from './components/Navbar/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import Mains from './components/Mains.vue'
</script>
<style lang="less">
.el-scrollbar {
  width: 100%;
}

.container {
  margin-top: 50px;
}
</style>