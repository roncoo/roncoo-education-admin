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

//import {useSidebarStore} from '@/store/modules/sidebar'
//const sidebarStore = useSidebarStore()
</script>
<style lang="less">
.container {
  margin-top: 50px;
}
</style>