<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="首页装修" name="dec">
        <el-row>
          <el-col :span="20"> sdf </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goDec">装修</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="导航设置" name="nav"> 导航设置 </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = new useRouter()

  // 装修
  const goDec = () => {
    router.push({ path: '/decoration/pc/dec' })
  }

  const activeName = ref('dec')
  // 切换
  const handleClick = (target) => {
    activeName.value = target.props.name
  }
</script>
<style lang="scss" scoped></style>
