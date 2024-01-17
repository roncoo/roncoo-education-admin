<template>
  <el-aside class="sidebar-container" @mouseleave="restoreSubMenu">
    <div class="menu-main">
      <el-menu
          mode="vertical"
          v-for="item in menuList"
      >
        <div class="menu-main-item" @mouseenter="showSubMenu(item)">
          <el-menu-item
              :index="item.menuName"
              :key="item.id"
          >
            {{ item.menuName }}
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <div class="menu-sub">
      <el-menu mode="vertical" v-for="sub in subMenu">
        <div class="menu-sub-item" @click="openMenu(sub)">
          <el-menu-item>
            <router-link v-if="sub.menuType === 2" :to="sub.path">
              {{ sub.menuName }}
            </router-link>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useUserStore} from '@/store/modules/user';
import Mains from '@/layout/components/Mains.vue';

// 当前子菜单
const subMenu = ref([])

const menuList = computed(() => useUserStore().getMenuList)

// 显示子菜单
function showSubMenu(sub) {
  subMenu.value = sub.children
}

// 重置子菜单
function restoreSubMenu() {
  subMenu.value = []
}

// 打开菜单
function openMenu(menu) {
  //subMenu.value = menu
}

</script>

<style lang="less" scoped>
.sidebar-container {
  overflow: auto;
  padding-top: 54px;

  .menu-main {
    width: 90px;
    float: left;
    min-height: calc(100vh - 50px);
    background-color: #15213e;
    padding-left: 10px;

    .menu-main-item {

      .el-menu-item {
        background-color: #fff;
        width: 90px;
        height: 50px;
        margin: 10px 0;
        border-radius: 10px 0 0 10px;
      }
    }
  }

  .menu-sub {
    width: 100px;
    float: left;
  }
}
</style>
