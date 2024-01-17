<template>
  <el-menu-item v-for="item in menuList" :index="item.id" :key="item.id">
    <el-icon>
      <icon-menu/>
    </el-icon>
    <router-link v-if="item.menuType === 2" :to="item.path">
      {{ item.menuName }}
    </router-link>
  </el-menu-item>
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
