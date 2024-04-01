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
        <enum-view v-if="scope.row.configKey === 'vodPlatform'" :enum-name="'VodPlatformEnum'" :enum-value="scope.row.configValue" />
        <enum-view v-if="scope.row.configKey === 'storagePlatform'" :enum-name="'StoragePlatformEnum'" :enum-value="scope.row.configValue" />
        <enum-view v-if="scope.row.configKey === 'smsPlatform'" :enum-name="'SmsPlatformEnum'" :enum-value="scope.row.configValue" />
        <br />
        <span style="color: #999; font-size: 13px">{{ scope.row.remark }}</span>
      </template>
    </el-table-column>
    <el-table-column v-permission="'sys:config:edit'" label="操作" width="220">
      <template #default="scope">
        <el-button text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="props.configType === '3'" class="page_head">
    <div class="clearfix">
      <div v-if="vodConfig" class="vod-info">
        <span>回调地址：{{ vodConfig }}</span>
      </div>
      <div v-if="!vodConfig" class="vod-info">
        <span>
          <el-button v-loading="loading" size="small" type="danger" v-permission="'sys:config:video:init'" @click="vodInit()">点击初始化</el-button>
          视频配置完成，需要重新初始化
        </span>
      </div>
    </div>
  </div>

  <config-form ref="formRef" @refresh="handleList"></config-form>
  <form-view ref="viewRef"></form-view>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import ConfigForm from './ConfigForm.vue'
  import FormView from './View.vue'
  import { systemApi } from '@/api/system.js'
  import { ElMessage } from 'element-plus'
  import EnumView from '@/components/Enum/View/index.vue'

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

  // 视频云初始化
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
    width: auto;
  }

  .vod-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    height: 35px;
    color: #999;
    font-size: 14px;
    span {
      margin-left: 10px;
      margin-right: 160px;
    }
  }
</style>
