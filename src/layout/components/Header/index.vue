<template>
  <div class="header backdrop-blur-sm bg-white/75 dark:bg-black/75">
    <div class="mx-4 text-lg logo">mocha Vue3 Admin</div>
    <!-- 折叠按钮 -->
    <div class="inline-flex items-center h-full text-xl" @click="collapseChage">
      <MoIcon icon-name="ep-expand" class="text-sm" v-if="sidebar.collapse"/>
      <MoIcon icon-name="ep-fold" class="text-sm" v-else/>
    </div>

    <div class="flex items-center pr-4 ml-auto">
      <el-switch
        v-model="darkMode"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        class="mx-2"
        @change="toggleDark()"
        style="--el-switch-on-color: #0960bd; --el-switch-off-color: #ff6600"
      />

      <el-select v-model="tenantId" class="mr-4" placeholder="Select">
        <el-option
          v-for="item in tenantOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="flex items-center">

        <!-- 消息中心 -->
        <!-- 用户头像 -->
        <el-avatar class="ml-2" :size="30" src=""/>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="mx-2" trigger="click" @command="handleCommand">
          <span class="flex items-center cursor-pointer">
            {{ username }}
            <el-icon class="el-icon--right">
              <MoIcon icon-name="ep-arrow-down"/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <a href="https://github.com/lucidity99/mocha-vue3-system" target="_blank">
                <el-dropdown-item>项目仓库</el-dropdown-item>
              </a>
              <el-dropdown-item command="user">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, reactive, ref} from 'vue'
import {useSidebarStore} from '@/store/modules/sidebar'
import {useRouter} from 'vue-router'
import {useDark, useToggle} from '@vueuse/core'
import {Sunny, Moon} from '@element-plus/icons-vue'
import {useUserStore} from '@/store/modules/user'

const isDark = useDark()
let darkMode = ref(false)
darkMode.value = isDark.value

const toggleDark = useToggle(isDark)

const userStore = useUserStore()

const tenantId = ref('mocha')
const tenantOptions = reactive([{value: 'mocha', label: 'mocha'}])

const username = userStore.getUserInfo

const sidebar = useSidebarStore()
// 侧边栏折叠
const collapseChage = () => {
  sidebar.handleCollapse()
}

onMounted(() => {
  if (document.body.clientWidth < 1200) {
    collapseChage()
  }
})

// 用户名下拉菜单选择事件
const router = useRouter()
const handleCommand = (command) => {
  if (command == 'loginout') {
    userStore.userLogout()
    router.push('/login')
  } else if (command == 'user') {
    router.push('/system/profile')
  }
}
</script>
