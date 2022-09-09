<template>
  <div v-if="status === 1" class="avatar-uploader" :style="'height:' + height + 'px;width:' + width + 'px;'">
    <div class="close-dialog" @click="closeUpload">
      <i class="el-icon-close avatar-uploader-icon" title="取消上传"/>
    </div>
    <el-progress class="upload-progress" :style="'line-height:' + height + 'px;'" type="circle" :percentage="int"/>
  </div>
  <el-upload v-else class="avatar-uploader" name="picFile" action="" :style="'height:' + height + 'px;width:' + width + 'px;'" :accept="accept" :show-file-list="false" :http-request="upload" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
    <svg-icon class="svg-icon" icon-class="plus" v-if="status === 0"/>
    <div v-else-if="status === 2" class="">
      <div class="close-dialog">
        <el-button class="reset-btn">重新上传</el-button>
      </div>
      <img :src="url" class="avatar" alt=""/>
    </div>
  </el-upload>
</template>

<script>
import {uploadPic} from '@/api/upload.js';

export default {
  name: 'UploadImage',
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
      accept: 'image/jpeg,image/png,image/gif,image/x-icon,',
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
        this.status = 1;
        this.int = int;
      }, this.params).then((res) => {
        this.status = 3;
        this.$emit('success', {url: res, ...res});
      });
    },
    closeUpload() {
      this.status = 0;
    },
    uploadSuccess(result) {
      //console.log(result);
    },
    handleAvatarSuccess(res, file) {
      this.url = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isIMG = this.accept.indexOf(file.type);
      const isLtM = file.size / 1024 / 1024 < 10;
      if (isIMG === -1) {
        this.$message.error('不支持上传该文件格式');
      }
      if (!isLtM) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isIMG !== -1 && isLtM;
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader {
  position: relative;

  .el-upload, .upload-progress {
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
