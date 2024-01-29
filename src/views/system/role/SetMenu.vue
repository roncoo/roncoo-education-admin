<template>
  <el-dialog title="菜单设置" :model-value="visible" width="600px" center @close="onClose()">
    <div style="min-height: 10vh">
      <el-tree
          :data="page.list"
          ref="tree"
          accordion
          highlight-current
          node-key="id"
          show-checkbox
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {systemApi} from '@/api/system'
import {reactive, ref} from 'vue';
import useTable from '@/utils/table';

const onSubmit = () => {
  console.log(11)
}

// 打开和关闭
const visible = ref(false);// 弹窗显示状态
const onOpen = (item: any) => {
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  visible.value = false;
}

// 基础功能
const apis = reactive({
  page: systemApi.sysMenuList,
})
const {page, handlePage} = reactive({
  ...useTable(apis)
})

console.log(page)
</script>
