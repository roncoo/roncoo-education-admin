<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{ item.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
  import { ArrowRight } from '@element-plus/icons-vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'

  const route = useRoute()

  const breadcrumbList = computed(() => {
    let menuId = route.name
    if (!menuId) {
      return []
    }
    return useUserStore().getBreadcrumbMap.get(menuId)
  })
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
    line-height: 50px;
    font-size: 14px;
  }
</style>
