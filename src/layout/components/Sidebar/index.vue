<template>
  <el-aside @mouseleave="restoreSubMenu">
    <div class="menu-main">
      <el-menu mode="vertical" v-for="item in menuList">
        <div class="menu-main-item" @mouseenter="showSubMenu(item.children)">
          <el-menu-item :class="[route.path === item.path ? 'store':'']" :key="item.id" :index="item.id">
            <span v-if="item.menuType === 1">{{ item.menuName }}</span>
            <app-link v-if="item.menuType === 2" :to="item.path" @click="showChildrenMenu(item.children, item)">
              {{ item.menuName }}
            </app-link>
          </el-menu-item>
        </div>
      </el-menu>
    </div>

    <!-- 子菜单 -->
    <div class="menu-sub" v-if="subMenuList">
      <el-menu mode="vertical" v-for="sub in subMenuList">
        <div class="menu-sub-item">
          <el-menu-item :key="sub.id" :index="sub.id">
            <app-link :to="sub.path" @click="showChildrenMenu(subMenuList, sub)">
              {{ sub.menuName }}
            </app-link>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useUserStore} from '@/store/modules/user';
import AppLink from './AppLink.vue'
import {useRoute} from "vue-router/dist/vue-router";

const subMenuList = ref([])
const storeMenuList = ref([])
const storeMenu = ref({})
const isCollapses = ref(true)
const menuList = computed(() => useUserStore().getMenuList)

const route = useRoute()
console.log(route.path, storeMenu.path)

// 查看子菜单
function showSubMenu(menuList: any) {
  subMenuList.value = menuList
  isCollapses.value = false
}

// 隐藏子菜单
function restoreSubMenu() {
  // 恢复原子菜单
  subMenuList.value = storeMenuList.value
  //isCollapses.value = true
}

// 显示选中子菜单
function showChildrenMenu(menuList: any, menu: any) {
  // 记录当前菜单列表和菜单
  storeMenuList.value = menuList
  storeMenu.value = menu
  console.log('storeMenu:', storeMenu.value.path)
}

</script>

<style lang="less" scoped>
.el-aside {
  position: fixed;
  width: 200px;
  z-index: 2000;
}

.menu-main {
  .el-menu {
    background-color: #15213e;
    border: 0;
  }

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

      &:hover {
        color: black;
      }

      &.store {
        background-color: #fff;
        color: black;
      }
    }

    .store {
      background-color: #fff;
      color: black;
    }
  }
}

.menu-sub {
  width: 100px;
  float: left;
  margin-top: 10px;

  .menu-sub-item {
    .el-menu-item {
      height: 45px;
      width: 80px;

      &:hover {
        margin: 0 10px;
        background-color: #f0f1ff;
        border-radius: 5px;
      }
    }
  }
}

</style>
