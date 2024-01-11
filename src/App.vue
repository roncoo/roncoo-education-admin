<template>
  <el-config-provider>
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import {onMounted, ref, reactive, onUnmounted} from 'vue'
import {ElConfigProvider} from 'element-plus'
import bus from '@/utils/bus'

const opts = reactive({
  imageList: '',
  type: '',
  videoInfo: {}
})
const ctrl = reactive({
  showImage: false,
  showImageViewer: false
})
const cloneImageDialog = () => {
  ctrl.showImage = false
}
const handleOpenImage = (url) => {
  opts.imageList = url
  ctrl.showImage = true
}
const handleOpenPreview = (row) => {
  opts.type = row.type
  opts.videoInfo = deepCopy(row.videoInfo)
  ctrl.showImageViewer = true
}
const handleClosePreview = () => {
  ctrl.showImageViewer = false
}
onMounted(() => {
  bus.on('handleOpenImage', handleOpenImage)
  bus.on('handleShowVideo', handleOpenPreview)
})
onUnmounted(() => {
  bus.off('handleOpenImage')
  bus.off('handleShowVideo')
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
