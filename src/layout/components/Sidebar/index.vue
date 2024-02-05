<template>
  <el-aside @mouseleave="restoreSubMenu">
    <div class="menu-main">
      <el-menu :default-active="showMenuId" mode="vertical" v-for="item in menuList">
        <div class="menu-main-item" @mouseenter="showSubMenu(item.children, item)" :class="[hoverMenuId === item.id ? 'hover':'']">
          <router-link :to="item.path" @click="handleMenu(item)">
            <el-menu-item :class="[item.id === showMenuId? 'is-active':'']" :key="item.id" :index="item.path">{{ item.menuName }}</el-menu-item>
          </router-link>
        </div>
      </el-menu>
    </div>
    <!-- 子菜单 -->
    <div class="menu-sub" v-if="subMenuList">
      <el-menu :default-active="showSubMenuId" mode="vertical" v-for="sub in subMenuList">
        <div class="menu-sub-item">
          <router-link :to="sub.path" @click="showChildrenMenu(subMenuList, sub)">
            <el-menu-item :class="[sub.id === showSubMenuId ? 'is-active':'']" :key="sub.id" :index="sub.path">
              {{ sub.menuName }}
            </el-menu-item>
          </router-link>
        </div>
      </el-menu>
    </div>
  </el-aside>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue'
import {useUserStore} from '@/store/modules/user';
import {useRoute} from "vue-router/dist/vue-router";
import router from "@/router";

// 加载用户菜单
const menuList = computed(() => useUserStore().getMenuList)

// 当前路由
const route = useRoute()

// 子菜单集合
const subMenuList = ref([])

// 菜单集合
const showMenuList = ref([])
const showMenuId = ref()
const showSubMenuId = ref()
const hoverMenuId = ref()

watchEffect(() => {
  showSubMenuId.value = route.name
  const mapList = useUserStore().getBreadcrumbMap.get(showSubMenuId.value)
  if (mapList && mapList.length > 0) {
    showMenuId.value = mapList[0].id
    if (mapList.length > 2) {
      showSubMenuId.value = mapList[1].id
    }
  } else {
    showMenuId.value = route.name
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

// 点击子菜单
function showChildrenMenu(menuList: any, menu?: any) {
  // 记录当前菜单列表和菜单
  showMenuList.value = menuList
  hoverMenuId.value = showMenuId.value
}

// 点击主菜单
function handleMenu(menu: any) {
  if (menu.children) {
    router.push({path: menu.children[0].path});
  }
  showMenuList.value = menu.children
  showMenuId.value = menu.id
  hoverMenuId.value = showMenuId.value
}
</script>

<style lang="less" scoped>
.el-aside {
  position: fixed;
  overflow: hidden;
  width: var(--el-aside-width, 200px);
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

      &.is-active {
        background-color: #fff;
        color: black;
      }
    }

    .is-active {
      background-color: #fff;
      color: black;
    }
  }

  .hover {
    background-color: #3b455d;
    color: #fff;
    border-radius: 10px 0 0 10px;
  }
}

.menu-sub {
  width: 100px;
  float: left;
  margin-top: 10px;

  .el-menu {
    border: none;
  }

  .menu-sub-item {
    .el-menu-item {
      height: 40px;

      &:hover {
        background-color: #f0f1ff;
        border-radius: 5px;
        justify-content: center;
        width: 80px;
        margin: 5px auto;
      }
    }

    .is-active {
      background-color: #f0f1ff;
      border-radius: 5px;
      justify-content: center;
      width: 80px;
      margin: 0 auto;
    }
  }
}

.is-active {
  color: black;
}
</style>
