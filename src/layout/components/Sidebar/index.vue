<template>
  <el-aside @mouseleave="restoreSubMenu">
    <div class="menu-main">
      <el-menu mode="vertical" v-for="item in menuList">
        <div class="menu-main-item" @mouseenter="showSubMenu(item.children, item)" :class="[hoverMenuId === item.id ? 'hover':'']">
          <el-menu-item :class="[showMenuId === item.id ? 'store':'']" :key="item.id" :index="item.path">
            <span v-if="item.menuType === 1" @click="toPage(item)">{{ item.menuName }}</span>
            <app-link v-if="item.menuType === 2" :to="item.path" @click="showChildrenMenu(item.children, item)">{{ item.menuName }}</app-link>
          </el-menu-item>
        </div>
      </el-menu>
    </div>

    <!-- 子菜单 -->
    <div class="menu-sub" v-if="subMenuList">
      <el-menu mode="vertical" v-for="sub in subMenuList">
        <div class="menu-sub-item">
          <app-link :to="sub.path" @click="showChildrenMenu(subMenuList, sub)">
            <el-menu-item :class="[sub.id === showSubMenuId ? 'store':'']" :key="sub.id" :index="sub.path">
              {{ sub.menuName }}
            </el-menu-item>
          </app-link>
        </div>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue'
import {useUserStore} from '@/store/modules/user';
import AppLink from './AppLink.vue'
import {useRoute} from "vue-router/dist/vue-router";
import router from "@/router";

// 加载用户菜单
const menuList = computed(() => useUserStore().getMenuList)

// 当前路由
const currentRoute = useRoute()

// 子菜单集合
const subMenuList = ref([])

// 菜单集合
const showMenuList = ref([])
const showMenuId = ref()
const showSubMenuId = ref()
const hoverMenuId = ref()

watchEffect(() => {
  showSubMenuId.value = currentRoute.name
  const mapList = useUserStore().getBreadcrumbMap.get(showSubMenuId.value)
  if (mapList && mapList.length > 0) {
    showMenuId.value = mapList[0].id
  } else {
    showMenuId.value = currentRoute.name
  }
})

onMounted(() => {
  const menu = menuList.value.filter((e: any) => e.id === showMenuId.value)
  if (menu && menu.length > 0) {
    subMenuList.value = menu[0].children
  }
  showMenuList.value = subMenuList.value
})

// 鼠标移入
function showSubMenu(menuList: any, menu: any) {
  subMenuList.value = menuList
  hoverMenuId.value = menu.id
}

// 鼠标移出
function restoreSubMenu() {
  subMenuList.value = showMenuList.value
  hoverMenuId.value = ''
}

// 鼠标点击子菜单
function showChildrenMenu(menuList: any, menu: any) {
  // 记录当前菜单列表和菜单
  showMenuList.value = menuList
  showMenuId.value = menu.id
  hoverMenuId.value = ''
}

// 鼠标点击主菜单
function toPage(menu: any) {
  if (menu.children) {
    router.push({path: menu.children[0].path});
  }
  showMenuList.value = menu.children
  showMenuId.value = menu.id
  hoverMenuId.value = ''
}

</script>

<style lang="less" scoped>
.el-aside {
  position: fixed;
}

.menu-main {
  .el-menu {
    background-color: #15213e;
    border: 0;
  }

  width: 90px;
  float: left;
  height: calc(100vh - 50px);
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
        background-color: #3b455d;
        color: #fff;
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
  .el-menu {
    border: none;
  }

  width: 100px;
  float: left;
  margin-top: 10px;
  transition: all 0.5s ease-in-out;

  .menu-sub-item {
    .el-menu-item {
      height: 45px;


      &:hover {
        background-color: #f0f1ff;
        border-radius: 5px;
      }
    }

    .store {
      background-color: #f0f1ff;
    }
  }
}

.hover {
  background-color: #3b455d;
  color: #fff;
  border-radius: 10px 0 0 10px;
}

.is-active {
  color: black;
}
</style>
