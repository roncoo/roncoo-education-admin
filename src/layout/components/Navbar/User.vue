<template>
  <div class="info">
    <!--<router-link to="/system/config"><el-icon><Setting /></el-icon></router-link>-->
    <el-dropdown class="user-info">
      <div>
        {{ realName }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { ref } from 'vue'
import { removeToken } from '@/utils/cookie'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { PATH } from '@/utils/constants/system'

const realName = ref(useUserStore().realName)
const router = useRouter()

/**
 * 退出登录
 */
const onLogout = () => {
  ElMessageBox.confirm('确认要退出登录?', '退出登录', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  }).then(async () => {
    removeToken()
    useUserStore().logout()
    await router.push({ path: PATH.URL_LOGIN })
  })
}
</script>
<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  float: right;
  height: 100%;
  line-height: 50px;
}

.user-info {
  align-items: center;
  float: right;
  margin-right: 20px;
  height: 100%;
  line-height: 50px;

  :focus-visible {
    outline: 0px;
  }
}
</style>
