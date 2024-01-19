<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{ item.title }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ currentRoute.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import {ArrowRight} from '@element-plus/icons-vue'
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useUserStore} from "@/store/modules/user";

let currentRoute = useRoute();

const breadcrumbList = computed(() => {
  let currentName = currentRoute.name;
  if (!currentName || typeof currentName !== 'string') {
    return [];
  }
  return useUserStore().getBreadcrumbMap.get(currentName)
})

</script>

<style lang="less">
.el-breadcrumb {
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
  line-height: 50px;
  font-size: 14px;
}
</style>
