<template>
  <el-table :data="props.list">
    <el-table-column label="配置名称" prop="configName" width="300">
      <template #default="scope">
        <span>{{ scope.row.configName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="参数">
      <template #default="scope">
        <span v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && scope.row.configShow">{{ scope.row.configValue }}</span>
        <el-button v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && !scope.row.configShow" @click="openRow(scope.row)" link>【点击查看详情】</el-button>
        <img v-if="scope.row.contentType === 3" :alt="scope.row.configName" :src="scope.row.configValue"/>
        <span v-if="scope.row.contentType === 4">{{ scope.row.configValue == 1 ? '开启' : '关闭' }}</span>
        <span v-if="scope.row.contentType === 5 && scope.row.configKey === 'storagePlatform'">{{ getEnumObj('StoragePlatformEnum')[scope.row.configValue] }}</span>
        <span v-if="scope.row.contentType === 5 && scope.row.configKey === 'vodPlatform'">{{ getEnumObj('VodPlatformEnum')[scope.row.configValue] }}</span>
        <span v-if="scope.row.contentType === 5 && scope.row.configKey === 'smsPlatform'">{{ getEnumObj('SmsPlatformEnum')[scope.row.configValue] }}</span>
        <br>
        <span style="color: #999;font-size: 13px">{{ scope.row.remark }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="220">
      <template #default="scope">
        <!-- 布尔类型 -->
        <el-switch v-if="scope.row.contentType === 4" v-model="scope.row.configValue" active-color="#13ce66" active-text="开启" active-value="1" inactive-color="#ff4949" inactive-text="关闭" inactive-value="0" @change="changBooleanValue(scope.row)"/>
        <!--  不为布尔类型 -->
        <el-button v-if="scope.row.contentType != 4" type="primary" @click="openFormModal(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {getEnumObj} from "@/utils/base";

const props = defineProps({
  list: {type: Array, default: []}
})

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any, parentId?: string) => {
  formRef.value.onOpen(item, parentId)
}

</script>
<style lang="less">
img {
  height: 50px;
}
</style>
