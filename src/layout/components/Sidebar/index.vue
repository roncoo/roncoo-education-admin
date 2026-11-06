<template>
  <el-aside :class="{ 'show-sub': subMenuList }" @mouseleave="restoreSubMenu">
    <div class="menu-side">
      <div class="menu-main">
        <el-menu v-for="item in menuList" :key="item.id" :default-active="showMenuId" mode="vertical">
          <div class="menu-main-item" :class="[hoverMenuId === item.id ? 'hover' : '']" @mouseenter="showSubMenu(item.children, item)">
            <router-link :to="item.path" @click="handleMenu(item)">
              <el-menu-item :key="item.id" :class="[item.id === showMenuId ? 'is-active' : '']" :index="item.path"> <icon :name="item.menuIcon" class="menu-icon" />{{ item.menuName }} </el-menu-item>
            </router-link>
          </div>
        </el-menu>
      </div>
      <!-- 子菜单 -->
      <div v-if="subMenuList" class="menu-sub">
        <el-menu v-for="sub in subMenuList" :key="sub.id" :default-active="showSubMenuId" mode="vertical">
          <div class="menu-sub-item">
            <router-link :to="sub.path" @click="showChildrenMenu(subMenuList)">
              <el-menu-item :key="sub.id" :class="[sub.id === showSubMenuId ? 'is-active' : '']" :index="sub.path"> {{ sub.menuName }} </el-menu-item>
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

  // 菜单集合
  const showMenuList = ref([])
  const showMenuId = ref()
  const showSubMenuId = ref()

  // 子菜单集合
  const subMenuList = ref([])
  // 选择的菜单ID
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
    flex: 0 0 auto;
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
    bottom: 0;
    display: flex;
    z-index: 10;
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

    // 原菜单由 90px 内容区 + 10px 左内边距组成。
    width: 100px;
    float: left;
    height: calc(100vh - 60px);
    background-color: #15213e;
    padding-left: 10px;

    a,
    a:hover,
    a:focus,
    a:active {
      color: inherit;
      text-decoration: none;
    }

    .menu-main-item {
      .el-menu-item {
        width: 90px;
        height: 50px;
        margin: 10px 0;
        padding: 0 12px;
        overflow: hidden;
        white-space: nowrap;
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
    height: calc(100vh - 60px);
    transition: all 0.5s;

    a,
    a:hover,
    a:focus,
    a:active {
      color: inherit;
      text-decoration: none;
    }

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
        padding: 0 8px;
        overflow: hidden;
        white-space: nowrap;
        color: #172b4d;

        &:hover {
          background-color: #f0f1ff;
          color: #172b4d;
          border-radius: 5px;
          width: 80px;
        }
      }

      .is-active {
        background-color: #f0f1ff;
        color: #172b4d;
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

  @media (max-width: 1024px) {
    .menu-main {
      width: 100px;
      padding-left: 10px;
    }

    .menu-sub {
      width: 100px;
    }
  }
</style>
