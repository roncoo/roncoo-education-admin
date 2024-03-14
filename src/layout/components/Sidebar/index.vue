<template>
  <el-aside @mouseleave="restoreSubMenu" :class="{ 'show-sub': subMenuList }">
    <div class="menu-side">
      <div class="menu-main">
        <el-menu :default-active="showMenuId" mode="vertical" v-for="item in menuList" :key="item.id">
          <div class="menu-main-item" @mouseenter="showSubMenu(item.children, item)" :class="[hoverMenuId === item.id ? 'hover' : '']">
            <router-link :to="item.path" @click="handleMenu(item)">
              <el-menu-item :class="[item.id === showMenuId ? 'is-active' : '']" :key="item.id" :index="item.path"> <icon :name="item.menuIcon" class="menu-icon" />{{ item.menuName }} </el-menu-item>
            </router-link>
          </div>
        </el-menu>
      </div>
      <!-- 子菜单 -->
      <div class="menu-sub" v-if="subMenuList">
        <el-menu :default-active="showSubMenuId" mode="vertical" v-for="sub in subMenuList" :key="sub.id">
          <div class="menu-sub-item">
            <router-link :to="sub.path" @click="showChildrenMenu(subMenuList)">
              <el-menu-item :class="[sub.id === showSubMenuId ? 'is-active' : '']" :key="sub.id" :index="sub.path"> {{ sub.menuName }} </el-menu-item>
            </router-link>
          </div>
        </el-menu>
      </div>
    </div>
  </el-aside>
</template>
<script setup>
  import { computed, onMounted, ref, watchEffect } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import { useRoute } from 'vue-router/dist/vue-router'
  import router from '@/router'

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
    const menu = menuList.value.filter((e) => e.id === showMenuId.value)
    if (menu && menu.length > 0) {
      subMenuList.value = menu[0].children
    }
    showMenuList.value = subMenuList.value
  })

  // 鼠标移入
  function showSubMenu(menuList, menu) {
    subMenuList.value = menuList
    hoverMenuId.value = menu.id
  }

  // 鼠标移出
  function restoreSubMenu() {
    subMenuList.value = showMenuList.value
    hoverMenuId.value = ''
  }

  // 点击子菜单
  function showChildrenMenu(menuList) {
    // 记录当前菜单列表和菜单
    showMenuList.value = menuList
    hoverMenuId.value = showMenuId.value
  }

  // 点击主菜单
  function handleMenu(menu) {
    if (menu.children) {
      router.push({ path: menu.children[0].path })
    }
    showMenuList.value = menu.children
    showMenuId.value = menu.id
    hoverMenuId.value = showMenuId.value
  }
</script>

<style lang="scss" scoped>
  .el-aside {
    overflow: hidden;
    width: 100px;

    &.show-sub {
      width: 200px;
    }

    transition: all 0.5s;
  }

  .menu-side {
    position: fixed;
    top: 60px;
  }

  .menu-main {
    .menu-icon {
      margin-right: 6px;
      width: 20px;
      height: 20px;
    }
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
    width: 0;
    opacity: 0;
    float: left;
    padding-top: 10px;
    background-color: #fff;
    height: calc(100vh - 50px);
    transition: all 0.5s;

    .el-menu {
      border: none;
    }

    .menu-sub-item {
      .el-menu-item {
        height: 40px;
        box-sizing: border-box;
        margin: 5px auto;
        justify-content: center;
        width: 80px;

        &:hover {
          background-color: #f0f1ff;
          border-radius: 5px;
          width: 80px;
        }
      }

      .is-active {
        background-color: #f0f1ff;
        border-radius: 5px;
        width: 80px;
      }
    }
  }

  .show-sub {
    .menu-sub {
      transition: all 0.5s;
      width: 100px;
      opacity: 1;
    }
  }

  .is-active {
    color: black;
  }
</style>
