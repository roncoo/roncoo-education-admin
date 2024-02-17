<template>
  <el-table :data="props.list">
    <el-table-column label="配置名称" prop="configName" width="300">
      <template #default="scope">
        <span>{{ scope.row.configName }}&nbsp;</span>
        <el-tooltip :content="scope.row.configKey" placement="right-start" effect="light">
          <el-icon>
            <InfoFilled/>
          </el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="参数">
      <template #default="scope">
        <span v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && scope.row.configShow">{{ scope.row.configValue }}</span>
        <el-button v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && !scope.row.configShow" link @click="handleView(scope.row)">【点击查看详情】</el-button>
        <img v-if="scope.row.contentType === 3" :alt="scope.row.configName" :src="scope.row.configValue"/>
        <span v-if="scope.row.contentType === 4">{{ scope.row.configValue == 1 ? '开启' : '关闭' }}</span>
        <span v-if="scope.row.configKey === 'storagePlatform'">{{ getEnumObj('StoragePlatformEnum')[scope.row.configValue] }}</span>
        <span v-if="scope.row.configKey === 'vodPlatform'">{{ getEnumObj('VodPlatformEnum')[scope.row.configValue] }}</span>
        <span v-if="scope.row.configKey === 'smsPlatform'">{{ getEnumObj('SmsPlatformEnum')[scope.row.configValue] }}</span>
        <br>
        <span style="color: #999;font-size: 13px">{{ scope.row.remark }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="220">
      <template #default="scope">
        <el-button type="primary" @click="openFormModal(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <form-model ref="formRef" @refresh="handleList"></form-model>
  <form-view ref="viewRef"></form-view>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {getEnumObj} from "@/utils/base";
import FormModel from "./FormModel.vue";
import FormView from "./View.vue";

const emit = defineEmits(['refresh'])
const handleList = () => {
  emit('refresh')
}

// 查看
const viewRef = ref()
const handleView = (item: any) => {
  viewRef.value.onOpen(item)
}

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any, parentId?: string) => {
  formRef.value.onOpen(item, parentId)
}

const props = defineProps({
  list: {type: Array, default: []}
})
</script>
<style lang="less" scoped>
img {
  height: 50px;
}
</style>
