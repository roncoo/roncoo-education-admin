<template>
  <el-container>
    <navbar />
    <el-scrollbar ref="scrollbarRef">
      <el-container class="container">
        <sidebar />
        <mains />
      </el-container>
    </el-scrollbar>
    <GlobalBackTop :scroll-target="scrollbarRef?.wrapRef" />
  </el-container>
</template>
<script setup>
  import Navbar from './components/Navbar/index.vue'
  import Sidebar from './components/Sidebar/index.vue'
  import Mains from './components/Mains.vue'
  import GlobalBackTop from '@/components/GlobalBackTop.vue'
  import { useWebsiteStore } from '@/store/modules/website.js'
  import { onMounted, ref } from 'vue'

  const scrollbarRef = ref(null)

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
    margin-top: 60px;
  }
</style>
