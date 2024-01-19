<template>
  <el-aside class="has_sub" @mouseleave="restoreSubMenu">
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

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useUserStore} from '@/store/modules/user';


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
.el-aside {
  position: fixed;
  width: 200px;
  z-index: 2000;
}

.has_sub {
  width: 200px;
}

.menu-main {
  width: 90px;
  float: left;
  min-height: calc(100vh - 50px);
  background-color: #15213e;
  padding-left: 10px;

  .menu-main-item {
    .el-menu-item {
      width: 90px;
      height: 50px;
      margin: 10px 0;
      color: white;
      border-radius: 10px 0 0 10px;
    }

    :hover {
      background-color: #fff;
      color: black;
    }
  }
}

.menu-sub {
  width: 100px;
  float: left;
}

.menu-main .el-menu {
  background-color: #15213e;
  border: 0;
}
</style>
