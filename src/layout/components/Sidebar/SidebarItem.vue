<template>
  <el-sub-menu v-for="item in menuList" :index="item.id" :key="item.id">
    <template #title>
      <el-icon>
        <icon-menu/>
      </el-icon>
      <router-link v-if="item.menuType === 2" :to="item.path">
        {{ item.menuName }}
      </router-link>
    </template>
    <SidebarItem :menu-list="item.children"/>
  </el-sub-menu>
</template>

<script setup name="SidebarItem">
import {Menu as IconMenu} from '@element-plus/icons-vue'

const props = defineProps({
  menuList: {
    type: Object,
    default: {}
  }
})
</script>
