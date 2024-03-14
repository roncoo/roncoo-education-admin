<template>
  <el-table :data="props.list">
    <el-table-column label="配置名称" prop="configName" width="300">
      <template #default="scope">
        <span>{{ scope.row.configName }}&nbsp;</span>
        <el-tooltip :content="scope.row.configKey" placement="right-start" effect="light">
          <el-icon>
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="参数">
      <template #default="scope">
        <span v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && scope.row.configShow">{{ scope.row.configValue }}</span>
        <el-button v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && !scope.row.configShow" link @click="handleView(scope.row)">【点击查看详情】</el-button>
        <img v-if="scope.row.contentType === 3" :alt="scope.row.configName" :src="scope.row.configValue" />
        <span v-if="scope.row.contentType === 4">{{ scope.row.configValue == 1 ? '开启' : '关闭' }}</span>
        <span v-if="scope.row.configKey === 'storagePlatform'">{{ getEnumObj('StoragePlatformEnum')[scope.row.configValue] }}</span>
        <span v-if="scope.row.configKey === 'vodPlatform'">{{ getEnumObj('VodPlatformEnum')[scope.row.configValue] }}</span>
        <span v-if="scope.row.configKey === 'smsPlatform'">{{ getEnumObj('SmsPlatformEnum')[scope.row.configValue] }}</span>
        <br />
        <span style="color: #999; font-size: 13px">{{ scope.row.remark }}</span>
      </template>
    </el-table-column>

    <el-table-column v-permission="'sys:config:edit'" label="操作" width="220">
      <template #default="scope">
        <el-button type="primary" @click="openFormModal(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="props.configType === '3'" class="page_head">
    <div class="clearfix">
      <div v-if="vodConfig" class="vod-info">
        <span>当前视频云回调地址：{{ vodConfig }}</span>
      </div>

      <div v-if="!vodConfig" class="vod-info">
        <span>
          视频配置完成之后，需要进行初始化处理
          <el-button v-loading="loading" size="small" type="primary" v-permission="'sys:config:video:init'" @click="vodInit()">点击这里初始化</el-button>
        </span>
      </div>
    </div>
  </div>

  <form-model ref="formRef" @refresh="handleList"></form-model>
  <form-view ref="viewRef"></form-view>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { getEnumObj } from '@/utils/base'
  import FormModel from './FormModel.vue'
  import FormView from './View.vue'
  import { systemApi } from '@/api/system.js'
  import { ElMessage } from 'element-plus'

  // 视频云初始化
  const loading = ref(false)
  const vodConfig = ref(null)
  const vodInit = async () => {
    loading.value = true
    const res = await systemApi.videoInit()
    loading.value = false
    ElMessage.success(res)
  }

  onMounted(() => {
    if (props.configType === '3') {
      handleConfig()
    }
  })
  const handleConfig = async () => {
    const res = await systemApi.videoConfig()
    vodConfig.value = res
  }

  const emit = defineEmits(['refresh'])
  const handleList = () => {
    emit('refresh')
  }

  // 查看
  const viewRef = ref()
  const handleView = (item) => {
    viewRef.value.onOpen(item)
  }

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  const props = defineProps({
    list: { type: Array, default: null },
    configType: { type: String, default: '' }
  })
</script>
<style lang="scss" scoped>
  img {
    height: 50px;
  }

  .vod-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    height: 50px;
    color: #2873f0;
    span {
      margin-left: 20px;
      margin-right: 160px;
    }
  }
</style>
