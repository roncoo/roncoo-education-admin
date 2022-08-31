<template>
  <div>
    <input id="file" type="file" :accept="fileType" style="display: none" @change="addUpload">
  </div>
</template>

<script>
import uploadMiXin from '@/utils/mixin/uploadVideo';

export default {
  name: '',
  mixins: [uploadMiXin],
  props: {
    fileType: {
      // 1问题图片，2问题答案，3习题图片，4习题答案
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      type: 4

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
// 加入上传列表
    addUpload(e) {
      const files = e.target.files;
      this.receiveFile(files);
      e.target.value = '';
    },
    // 选择上传课件
    upimg() {
      this.isPolyvUpload = false;
      const myfile = document.getElementById('file');
      myfile.click();
    },
    savaVideo(fileData) {
      this.$emit('submit', fileData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
