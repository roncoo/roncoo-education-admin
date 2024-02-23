<template>
  <el-result status="404" title="对不起，您访问的内容不存在！">
    <template #extra>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </template>
  </el-result>

</template>
<script setup>
import {useRouter} from 'vue-router';
import {PATH} from '@/utils/constants/system';

const router = useRouter()

function goHome() {
  router.push({path: PATH.URL_DASHBOARD});
}
</script>