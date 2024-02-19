<template>
  <el-dialog :append-to-body="true" :model-value="visible" title="预览" width="600px" center @close="onClose">
    <div class="play">
      <div id="players"></div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {courseApi} from '@/api/course';

const props = defineProps({
  resourceId: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  }
})
const visible = ref(props.visible)

onMounted(async () => {
  const res = await courseApi.resourceLibraryPreview({id: props.resourceId})
  console.log(JSON.parse(res.vodPlayConfig))

  const polyvPlayer = window.polyvPlayer;
  const player = polyvPlayer({
    wrap: '#players',
    vid: res.vid
  });

  console.log(player)
})

const onClose = () => {
  visible.value = false;
}
</script>
<style lang="less" scoped>

</style>
