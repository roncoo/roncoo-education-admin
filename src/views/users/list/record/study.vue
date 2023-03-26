<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="title" width="800px" @close="cloneDialog">
    <el-table :data="info" row-key="id" :tree-props="{ children: 'userStudyPeriodPageRespList' }" default-expand-all>
      <el-table-column label="章节名称" prop="chapterName">
        <template #default="scope">
          <span>{{ scope.row.chapterName }}</span>
          <span>{{ scope.row.periodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习时间" prop="gmtCreate" width="200">
        <template #default="scope">
          <span v-if="scope.row.progress >0">{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习进度" prop="courseProgress" width="200">
        <template #default="scope">
          <el-progress v-if="scope.row.progress" :percentage="scope.row.progress" :stroke-width="25" :text-inside="true"/>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import {defineComponent, reactive, ref, toRefs, watch} from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: () => {
        return false;
      }
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
  emits: ['update:modelValue'],
  setup(props, {emit}) {

    const state = reactive({});
    const visible = ref(false);
    let {modelValue, info} = toRefs(props);
    // 弹窗是否要打开监控
    watch(modelValue, async(val) => {
      visible.value = val;
    });
    console.log('info', info)

    const cloneDialog = () => {
      visible.value = false;
      emit('update:modelValue', false);
    };
    return {
      ...toRefs(state),
      visible,
      cloneDialog
    };
  }
});
</script>
