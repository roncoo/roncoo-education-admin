<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="'学习记录'" width="800px" center align-center @close="onClose" :destroy-on-close="true">
    <el-table :data="tableData" :tree-props="{ children: 'userStudyPeriodPageRespList' }" default-expand-all row-key="id">
      <el-table-column label="章节名称" prop="chapterName">
        <template #default="scope">
          <span>{{ scope.row.chapterName }}</span>
          <span>{{ scope.row.periodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习时间" prop="gmtCreate" width="200">
        <template #default="scope">
          <span v-if="scope.row.progress > 0">{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习进度" prop="courseProgress" width="200">
        <template #default="scope">
          <el-progress v-if="scope.row.progress" :percentage="scope.row.progress" :stroke-width="15" :text-inside="true" />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script setup>
  import { ref } from 'vue'
  import { courseApi } from '@/api/course.js'

  const tableData = ref()

  // 打开和关闭
  const visible = ref(false)
  const onOpen = (item) => {
    if (item) {
      courseApi.userStudyPage({ courseId: item.courseId, userId: item.userId }).then((res) => {
        tableData.value = res.list
      })
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
  }
</script>
