<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="props.resourceName" width="600px" center align-center @close="onClose" :destroy-on-close="true">
    <div id="player"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    resourceId: {
      type: String,
      default: ''
    },
    resourceName: {
      type: String,
      default: '预览'
    },
    visible: {
      type: Boolean,
      default: false
    }
  })
  const visible = ref(props.visible)

  onMounted(async () => {
    const res = await courseApi.resourceLibraryPreview({ id: props.resourceId })
    const params = JSON.parse(res.vodPlayConfig)
    if (res.vodPlatform === 1) {
      console.log(params)
      // 简易
      simplePlay(params)
    } else if (res.vodPlatform === 2) {
      // 保利威
      polyvPlay(params)
    } else {
      // 简易
      ElMessage.warning('暂不支持该播放器')
    }
  })

  function simplePlay(params) {
    window.polyvPlayer({
      wrap: '#player',
      autoplay: true,
      hideSwitchPlayer: true,
      showLine: 'off',
      height: 350,
      url: params.hdUrl
    })
  }

  const polyvPlay = (params) => {
    window.polyvPlayer({
      wrap: '#player',
      autoplay: true,
      hideSwitchPlayer: true,
      showLine: 'off',
      height: 350,
      playsafe: params.token,
      ...params
    })
  }

  const emit = defineEmits(['close'])
  const onClose = () => {
    visible.value = false
    emit('close')
  }
</script>
<style lang="scss" scoped></style>
