<template>
  <el-table :data="props.list">
    <el-table-column label="配置名称" prop="configName" min-width="30">
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
        <el-button v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && !scope.row.configShow" link type="primary" @click="handleView(scope.row)">【查看详情】</el-button>
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
  <div v-if="props.configType === '3'">
    <div class="clearfix">
      <el-row class="vod-info">
        <el-col :span="6"> &nbsp;&nbsp;&nbsp;&nbsp;视频回调地址</el-col>
        <el-col :span="14">
          <div v-if="vodConfig">{{ vodConfig }}</div>
          <div style="color: #999; font-size: 12px">视频配置完成，需要重新初始化</div>
        </el-col>
        <el-col :span="4"><el-button v-loading="loading" text type="primary" v-permission="'sys:config:video:init'" @click="vodInit()">视频初始化</el-button></el-col>
      </el-row>
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
  import { ElMessage, ElMessageBox } from 'element-plus'
  import EnumView from '@/components/Enum/View/index.vue'

  // 视频云初始化
  const loading = ref(false)
  const vodConfig = ref(null)
  const vodInit = () => {
    ElMessageBox.confirm('确定初始化视频云配置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      loading.value = true
      systemApi.videoInit().then((res) => {
        ElMessage.success(res)
        loading.value = false
      })
    })
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
    color: #606266;
    line-height: 2;
    font-size: 14px;
    span {
      margin-left: 10px;
      margin-right: 160px;
    }
  }
</style>
