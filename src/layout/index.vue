<template>
  <header :class="{ 'header-collapse': sidebarStore.collapse }"/>
  <sidebar/>
  <mains/>
</template>
<script setup>
import Header from './components/Header/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import Mains from './components/Mains.vue'

import {useSidebarStore} from '@/store/modules/sidebar'

const sidebarStore = useSidebarStore()
</script>
