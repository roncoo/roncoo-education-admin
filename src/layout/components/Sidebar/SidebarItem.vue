<template>

  <el-sub-menu v-for="item in menuList" :key="item.id">
    <router-link v-if="item.menuType === 2" :to="item.path">
      <template #title>
        <el-icon>
          <icon-menu/>
        </el-icon>
        {{ item.menuName }}
      </template>
      <SidebarItem :menu-list="item.children"/>
    </router-link>
  </el-sub-menu>
</template>

<script setup name="SidebarItem">
import menuList from 'wangeditor/src/menus/menu-list';

const props = defineProps({
  menuList: {
    type: Object,
    default: {}
  }
})
</script>
