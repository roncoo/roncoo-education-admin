<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="'移动指定目录'" width="600px" center align-center @close="onClose" :destroy-on-close="true">
    <div class="move-model">
      <el-tree
        ref="treeRef"
        default-expand-all
        highlight-current
        :data="treeData"
        :props="{ value: 'id', label: 'categoryName', children: 'childrenList' }"
        :expand-on-click-node="false"
        node-key="id"
        @node-click="handleNode"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <img src="@/assets/images/folder.svg" />&nbsp;
            <span :class="{ active: formModel.categoryId === data.id }">{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { courseApi } from '@/api/course.js'

  // 分类ID
  const handleNode = (data) => {
    formModel.categoryId = data.id
  }
  const treeRef = ref()

  // 列出文件夹
  const treeData = ref()
  onMounted(() => {
    handleCatalog()
  })
  const handleCatalog = () => {
    courseApi.categoryList({ categoryType: 2 }).then((res) => {
      treeData.value = res
    })
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    ids: [],
    categoryId: undefined
  }
  const formModel = reactive({ ...formDefault })
  const onSubmit = async () => {
    if (loading.value === true) {
      ElMessage.warning('正在处理···')
      return
    }
    loading.value = true
    try {
      await courseApi.resourceBatchEdit(formModel)
      ElMessage.success('修改成功')
      emit('refresh')
      onClose()
    } finally {
      loading.value = false
    }
  }

  // 打开和关闭
  const visible = ref(false) // 弹窗显示状态
  const onOpen = (item) => {
    if (item) {
      formModel.ids = item
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
<style scoped lang="scss">
  .move-model {
    max-height: calc(60vh);
    overflow: auto;
  }
</style>
