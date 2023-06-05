<template>
  <el-config-provider :locale="locale === 'en' ? ElementPlusEn : ElementPlusZhCn">
    <router-view />
    <preview v-model="ctrl.showImageViewer" :type="opts.type" :url="opts.imageList" :video-info="opts.videoInfo" @callback="handleClosePreview" />
    <fixed-upload-panel />
  </el-config-provider>
</template>

<script>
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { onMounted, ref, reactive, onUnmounted } from "vue";
import { ElConfigProvider } from 'element-plus'
import ElementPlusZhCn from "element-plus/lib/locale/lang/zh-cn";
import ElementPlusEn from "element-plus/lib/locale/lang/en";
import FixedUploadPanel from '@/components/Upload/FixedUploadPanel.vue';
import Preview from '@/views/course/material/preview.vue'
import bus from '@/utils/bus';
export default {
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    FixedUploadPanel,
    Preview
  },
  setup() {
    const { locale } = useI18n()
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
    return {
      locale,
      ElementPlusZhCn,
      ElementPlusEn,
      ctrl,
      opts,
      cloneImageDialog,
      handleClosePreview
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
