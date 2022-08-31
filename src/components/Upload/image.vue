<template>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import {uploadPic} from '@/api/upload.js';

export default {
  name: 'UploadImage',
  //mixins: [uploadmixin],
  props: {
    width: {
      type: Number,
      default: 356
    },
    height: {
      type: Number,
      default: 178
    },
    imageUrl: {
      // 默认图片路径
      type: [String, Number],
      default: ''
    },
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      accept: '',
      imageType: 'image/jpeg,image/png,image/gif,image/x-icon,',
      status: 0, //  0:未上传， 1：正在上传， 2：已完成
      int: 50,
      url: ''
    };
  },
  watch: {
    imageUrl(newData) {
      if (newData) {
        this.url = newData;
        this.status = 2;
      } else {
        this.url = '';
        this.status = 0;
      }
    }
  },
  mounted() {
    if (this.fileType === 2) {
      this.accept = this.imageType;
    }
    if (this.fileType === 3) {
      this.accept = this.videoType;
    }
    if (this.imageUrl) {
      this.url = this.imageUrl;
      this.status = 2;
    } else {
      this.url = '';
      this.status = 0;
    }
  },
  methods: {
    upload(file) {
      uploadPic(file, (int) => {
        this.int = int;
      }, this.params).then((res) => {
        this.$emit('success', {url: res, ...res});
      });
    },
    closeUpload() {
      this.status = 0;
    },
    handleAvatarSuccess(res, file) {
      this.url = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB');
      }
      return isLt2M;
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader {
  position: relative;

  .el-upload,
  .upload-progress {
    width: 100%;
    height: 100%;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    width: 100%;
    font-size: 28px;
    line-height: 0;
    color: #8c939d;
    text-align: center;
    height: 0;
    position: absolute;
    top: 50%;
    left: 0;
  }

  .avatar {
    height: 100%;
    display: block;
    margin: 0 auto;
    overflow: hidden;
  }

  .el-progress-circle {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;

    svg {
      padding: 10px;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  .close-dialog {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;

    .avatar-uploader-icon {
      color: #fff;
      font-size: 42px;
    }

    .reset-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -14px;
      margin-left: -40px;
    }
  }

  &:hover {
    .close-dialog {
      display: block;
    }
  }
}
</style>
