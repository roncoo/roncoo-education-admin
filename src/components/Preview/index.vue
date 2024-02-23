<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="props.resourceName" width="600px" center @close="onClose">
    <div id="player"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {courseApi} from '@/api/course';

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
  const res = await courseApi.resourceLibraryPreview({id: props.resourceId})
  const params = JSON.parse(res.vodPlayConfig)
  if (res.vodPlatform === 2) {
    // 保利威
    polyvPlay(params)
  }
})

const polyvPlay = (params) => {
  window.polyvPlayer({
    wrap: '#player',
    autoplay: true,
    hideSwitchPlayer: true,
    showLine: 'off',
    playsafe: params.token,
    ...params
  });
}

const emit = defineEmits(['close']);
const onClose = () => {
  visible.value = false;
  emit('close')
}
</script>
<style lang="less" scoped>

</style>
