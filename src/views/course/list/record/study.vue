<template>
  <el-dialog v-model="visible" :append-to-body="true" :title="title" width="600px" @close="handleClose">
    <el-table :data="info" :tree-props="{ children: 'userStudyPeriodPageRespList' }" default-expand-all>
      <el-table-column label="章节名称" prop="chapterName">
        <template #default="scope">
          <span>{{ scope.row.chapterName }}</span>
          <span>{{ scope.row.periodName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '学习记录'
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup() {
    const state = reactive({});
    const visible = ref(false);

    const handleClose = () => {
      visible.value = false;
    };
    return {
      ...toRefs(state),
      visible,
      handleClose
    };
  }
});
</script>
