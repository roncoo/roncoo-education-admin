<template>
  <el-aside width="200px">
    <el-menu
      class="shadow bg-white/75 dark:bg-black/75 backdrop-blur-sm"
      :class="sidebar.collapse"
      :collapse="sidebar.collapse"
      router
    >
      <SidebarItem :item="item" v-for="item in items" :key="item.name"/>
    </el-menu>
  </el-aside>
</template>

<script setup>
import router from '@/router'
import {useSidebarStore} from '@/store/modules/sidebar'
import {useUserStore} from '@/store/modules/user'
import SidebarItem from './SidebarItem.vue'

const sidebar = useSidebarStore()
const useUser = useUserStore()

let items

if (import.meta.env.VITE_PERMISSION_MODE === 'CONSTANT') {
  items = router.options.routes.filter((r) => !r.hidden)
} else {
  items = useUser.menuRoutes
}


</script>
