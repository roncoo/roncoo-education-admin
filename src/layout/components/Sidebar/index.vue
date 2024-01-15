<template>
  <el-aside>
    <el-scrollbar>
      <el-menu v-for="item in menuList">
        <el-sub-menu :index="item.menuName" :key="item.id">
          <template #title>
            <el-icon>
              <icon-menu/>
            </el-icon>
            {{ item.menuName }}
          </template>
          <SidebarItem :menu-list="item.children"/>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import {computed} from 'vue'
import {Menu as IconMenu} from '@element-plus/icons-vue'
import {useUserStore} from '@/store/modules/user';
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue';

const menuList = computed(() => useUserStore().getMenuList)

</script>

<style lang="less" scoped>
</style>
