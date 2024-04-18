<template>
  <el-container>
    <navbar />
    <el-scrollbar>
      <el-container class="container">
        <sidebar />
        <mains />
      </el-container>
    </el-scrollbar>
  </el-container>
</template>
<script setup>
  import Navbar from './components/Navbar/index.vue'
  import Sidebar from './components/Sidebar/index.vue'
  import Mains from './components/Mains.vue'
  import { useWebsiteStore } from '@/store/modules/website.js'
  import { onMounted } from 'vue'

  onMounted(() => {
    // 初始化
    useWebsiteStore().init()
  })
</script>
<style lang="scss" scoped>
  .el-scrollbar {
    width: 100%;
  }

  .container {
    margin-top: 50px;
  }
</style>
