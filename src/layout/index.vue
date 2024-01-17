<template>
  <el-container>
    <sidebar/>
    <el-container>
      <header-avatar/>
      <mains/>
    </el-container>
  </el-container>
</template>
<script setup>
import HeaderAvatar from './components/Header/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import Mains from './components/Mains.vue'

import {useSidebarStore} from '@/store/modules/sidebar'

const sidebarStore = useSidebarStore()
</script>
