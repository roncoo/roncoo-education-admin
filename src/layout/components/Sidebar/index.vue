<template>
  <el-aside class="sidebar-container">
    <div class="menu">
      <el-menu
          :collapse="false"
          mode="vertical"
          v-for="item in menuList"
      >
        <el-sub-menu @mouseenter="openSubMenu(item)"
                     :index="item.menuName"
                     :key="item.id"
        >
          <template #title>
            {{ item.menuName }}
          </template>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="menu">
      <el-menu mode="vertical">
        <el-menu-item v-for="sub in subMenu">
          <router-link v-if="sub.menuType === 2" :to="sub.path">
            {{ sub.menuName }}
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup>
import {computed, ref} from 'vue'
import {Menu as IconMenu} from '@element-plus/icons-vue'
import {useUserStore} from '@/store/modules/user';
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue';

// 当前子菜单
const subMenu = ref([])

const menuList = computed(() => useUserStore().getMenuList)

function openSubMenu(menu) {
  subMenu.value = menu.children
  console.log(subMenu)
}


</script>

<style lang="less" scoped>
.sidebar-container {
  overflow: auto;
  padding-top: 54px;
  min-height: 100vh;
  background-color: #15213e;

  .menu {
    width: 100px;
    float: left;
  }
}
</style>
