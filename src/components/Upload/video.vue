<template>
  <div>
    <div class="mask" style="z-index: 2999" @click="close()" />
    <div
      id="image_panel_importance"
      class="modal_panel image_panel"
      style="z-index: 2999"
    >
      <div class="modal_head">
        <span class="fl">课件管理</span>
        <a href="javascript:" class="close el-icon-close" @click="close()" />
      </div>
      <div class="modal_body">
        <div class="upload_box clearfix">
          <span />
          <div class="fr">
            <span>相同课件上传两次，第二次不上传！</span>
            <input
              id="file"
              type="file"
              multiple="multiple"
              :accept="videoType"
              style="display: none"
              @change="addUpload"
            >
            <el-button type="primary" @click="upimg">本地上传</el-button>
          </div>
        </div>
        <div class="image_list">
          <div class="left_list">
            <div data-v-1300c342 class="title">已选课件</div>
            <ul class>
              <li v-for="(item, index) in videoList" :key="index" class="img">
                <div class="oper">
                  <i
                    class="el-icon-circle-close gb"
                    title="从库移除"
                    @click="delVideo(item.videoId, 1)"
                  />
                </div>
                <div
                  v-if="item.coursewareType == 1"
                  class="icon el-icon-video-play"
                />
                <div
                  v-if="item.coursewareType == 2"
                  class="icon el-icon-headset"
                />
                <div
                  v-if="item.coursewareType == 3"
                  class="icon el-icon-notebook-2"
                />
                <a :title="item.coursewareName" href="javascript:">{{
                  item.coursewareName
                }}</a>
              </li>
            </ul>
          </div>
          <div v-loading="loading" class="right_list">
            <div data-v-1300c342 class="title">课件库列表</div>
            <ul>
              <li
                v-for="(item, index) in chapterVideoList"
                :key="index"
                class="img"
                title="点击选择"
                @click="selVideo(item)"
              >
                <div class="oper">
                  <i
                    class="gb el-icon-circle-close"
                    title="从库移除"
                    @click.stop="delVideo(item.id, 0, item.id)"
                  />
                </div>
                <div
                  v-if="item.coursewareType == 1"
                  class="icon el-icon-video-play"
                />
                <div
                  v-if="item.coursewareType == 2"
                  class="icon el-icon-headset"
                />
                <div
                  v-if="item.coursewareType == 3"
                  class="icon el-icon-notebook-2"
                />
                <a :title="item.coursewareName" href="javascript:">{{
                  item.coursewareName
                }}</a>
              </li>
              <li
                v-for="(item, index) in uploadStatus"
                :key="index + 'ls'"
                :class="{ error: item.status == 4 }"
                class="img"
                :hidden="item.status == 7"
              >
                <div class="tip">{{ item.status | uploadStatus }}</div>
                <div class="progress">
                  <div class="entity" :style="{ width: item.progress + '%' }" />
                </div>
                <!-- <button
                  v-if="item.status == 2"
                  class="reput-btn"
                  @click="stopUpload(index)"
                >
                  暂停上传
                </button> -->
                <button
                  v-if="item.status == 4"
                  class="reput-btn"
                  @click="resumeUpload(index)"
                >
                  重新上传
                </button>
                <button
                  v-if="item.status == 5"
                  class="reput-btn"
                  @click="resumeUpload(index)"
                >
                  继续上传
                </button>
                <a href="javascript:">{{ item.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="modal_foot">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadMiXin from '@/utils/mixin/uploadVideo';
import {
  chapterVideoSave,
  chapterVideo,
  chapterVideodel
} from '@/api/course/course.js';

import { unbind } from '@/api/course/period.js';
export default {
  mixins: [uploadMiXin],
  props: {
    data: {
      type: [Object, String],
      default: null
    },
    type: {
      // 1问题图片，2问题答案，3习题图片，4习题答案
      type: [String, Number],
      default: 1
    },
    fileType: {
      // 1问题图片，2问题答案，3习题图片，4习题答案
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      flag: true,
      kg: true,
      open: false,
      loading: false,
      chapterVideoList: [],
      videoList: [],
      videoType:
        'video/mp4,video/avi,video/mpg,video/mpeg,video/ram,video/flv,video/mov,video/asf,video/3gp,video/f4v,video/wmv,video/x-ms-wmv'
    };
  },
  watch: {
    type() {
      this.videoList = [];
      this.getChapterVideo();
    }
  },
  created() {
    this.kg = false;
    // this.periodVideoList();
    this.loading = true;
    if (this.type === 1) {
      this.videoType =
        'video/mp4,video/avi,video/mpg,video/mpeg,video/ram,video/flv,video/mov,video/asf,video/3gp,video/f4v,video/wmv,video/x-ms-wmv';
    }
    if (this.type === 2) {
      this.videoType =
        'audio/mpeg,audio/wma,audio/wav,audio/ape,audio/flac,audio/ogg,audio/aac';
    }
    if (this.type === 3) {
      this.videoType = '.pdf';
    }

    if (this.fileType) {
      this.videoType = this.fileType;
    }
    this.getChapterVideo();
    this.initOssConfig();
  },
  methods: {
    // 选择上传课件
    upimg() {
      if (this.type === 3) {
       this.initOssConfig(3);
        this.isPolyvUpload = false;
      } else if (!this.isBackupAli && !this.isPolyvUpload) {
        this.isPolyvUpload = true;
      }
      const myfile = document.getElementById('file');
      myfile.click();
    },
    show() {
      this.open = true;
    },
    // 选择课件
    selVideo(obj) {
      obj.videoId = obj.id;
      this.videoList = [obj];
    },
    // 加入上传列表
    addUpload(e) {
      const files = e.target.files;
      console.log(files)
      this.receiveFile(files);
      e.target.value = '';
    },
    // 保存课件
    savaVideo(data, int) {
      this.uploadStatus[int].status = 6;
      const params = {
        periodId: this.data.id,
        chapterId: this.data.chapterId,
        coursewareName: data.videoName,
        courseId: this.data.courseId,
        coursewareType: this.type,
        videoMd5: this.uploadStatus[int].md5 || '',
        ...data
      };
      chapterVideoSave(params).then((res) => {
        this.getChapterVideo(int);
      });
    },
    // 删除课件
    delVideo(vNo, ty, id) {
      const periodId = this.data.id
      if (ty) {
        this.$confirm('你确定要删除该课件吗?', '提示', {
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.videoList.length; i++) {
            if (this.videoList[i].videoId === vNo) {
              (async(i) => {
                const res = await unbind({
                  periodId: periodId
                });
                if (res) {
                  this.videoList.splice(i, 1);
                }
              })(i);
            }
          }
        });
      } else {
        this.flag = true;
        for (let i = 0; i < this.videoList.length; i++) {
          if (this.videoList[i].videoId === vNo) {
            this.flag = false;
          }
        }
        if (this.flag) {
          this.$confirm('你确定要删除该课件吗?', '提示', {
            type: 'warning'
          })
            .then(() => {
              this.loading = true;
              chapterVideodel({ id: vNo })
                .then((res) => {
                    this.loading = false;

                  if (res) {
                    this.initOssConfig();
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.getChapterVideo();
                  }
                })
                .catch(() => {
                  this.loading = false;
                });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message.error('该课件已被使用，请先删除');
        }
      }
    },
    // 提交保存选中课件
    submit() {
      const su = () => {
        const vid =
          this.videoList && this.videoList.length ? this.videoList[0].vid : '';
        const id =
          this.videoList && this.videoList.length ? this.videoList[0].id : '';
        const coursewareName =
          this.videoList && this.videoList.length
            ? this.videoList[0].coursewareName
            : '';
            const coursewareLength =
          this.videoList && this.videoList.length
            ? this.videoList[0].coursewareLength
            : '';
        const ossUrl =
          this.videoList && this.videoList.length
            ? this.videoList[0].ossUrl
            : '';
        const params = {
          vid,
          id,
          coursewareName,
          coursewareLength,
          ossUrl
        };
        this.$emit('submit', params);
        this.open = false;
      };
      if (this.uploading) {
        this.$confirm('课件正在上传,确定关闭上传窗口吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.stopAllUpload();
          su();
        });
      } else {
        su();
      }
    },
    close() {
      if (this.uploading) {
        this.$confirm('课件正在上传,确定关闭上传窗口吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.stopAllUpload();
          this.$emit('close');
        });
      } else {
        this.$emit('close');
      }
    },
    btnClick(event) {
      this.$emit('btnClick', event);
    },
    changeTab(int) {
      this.$emit('change', int);
    },
    getChapterVideo(int) {
      chapterVideo({
        chapterId: this.data.chapterId,
        coursewareType: this.type
      })
        .then((res) => {
          if (this.uploadStatus[int]) {
            this.uploadStatus[int].status = 7;
          }
          this.loading = false;
          this.chapterVideoList = res.list || [];
          this.videoList = [];
          this.chapterVideoList.forEach((e) => {
            if (e.id === this.data.coursewareId) {
              this.videoList.push(e);
            }
          });
          this.uploadUploading();
        })
        .catch(() => {
          this.loading = false;
          this.chapterVideoList = [];
        });
    },
    uploadSuccess(fileData, fileIndex) {
      if (fileData.vid) {
        this.savaVideo(
          {
            vid: fileData.vid,
            videoName: fileData.file.name
          },
          fileIndex
        );
      } else {
        this.savaVideo(
          {
            ossUrl: fileData.url.substr(0, fileData.url.indexOf('?')),
            videoName: fileData.name
          },
          fileIndex
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.modal_head {
  line-height: 46px;
  background-color: #f9f9f9;
  text-align: right;
  padding: 0 20px;
  border-bottom: 1px solid #e7e7eb;
}
.modal_panel {
  position: fixed;
  z-index: 2999;
  top: 5%;
  left: 50%;
  width: 1160px;
  margin-left: -580px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
#image_panel_importance {
  width: 720px;
  margin-left: -360px;
}
.image_panel {
  width: 720px;
  margin-left: -360px;
  div.modal_body {
    overflow: hidden;
  }
  .upload_box {
    line-height: 36px;
    padding: 10px 20px;
    border-bottom: 1px solid #e7e7eb;
    span {
      margin-right: 12px;
      color: #666;
    }
  }
  .modal_foot {
    border-top: 1px solid #e7e7eb;
    padding: 20px;
    text-align: center;
  }
  .image_list {
    overflow: hidden;
    height: 403px;
    .title {
      line-height: 30px;
      padding: 0 20px;
      font-size: 14px;
      background-color: #eee;
    }
    .left_list {
      float: left;
      width: 187px;
      border-right: 2px solid #ddd;
    }
    .right_list {
      float: right;
      width: 531px;
    }
    ul {
      height: 373px;
      overflow: auto;
    }
    .icon {
      text-align: center;
      line-height: 80px;
      font-size: 50px;
      color: #999;
    }
    .img {
      position: relative;
      float: left;
      margin-left: 16px;
      text-align: center;
      margin-top: 16px;
      width: 153px;
      border: 1px solid #e7e7eb;
      .oper {
        display: none;
      }
      .gb {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 18px;
        cursor: pointer;
        color: #666;
      }
      img {
        display: block;
        height: 80px;
      }
      a {
        display: block;
        text-align: center;
        line-height: 30px;
        border-top: 1px solid #e7e7eb;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sel {
        color: #eee;
        margin: 0 3px;
      }
      &:hover {
        border-color: #ed7d03;
        .oper {
          display: block;
        }
        .icon {
          color: #ed7d03;
        }
      }
    }
    .tip {
      height: 80px;
      text-align: center;
      font-size: 16px;
      line-height: 60px;
    }
    .progress,
    .oper {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      z-index: 9;
      height: 80px;
      .entity {
        height: 100%;
        background-color: rgba(0, 204, 0, 0.59);
      }
    }
    .reput-btn {
      position: absolute;
      width: 70px;
      top: 50%;
      margin-top: -12px;
      left: 50%;
      margin-left: -35px;
      background: #bbb;
      border: 1px solid #aaa;
      z-index: 9;
      color: #666;
      cursor: pointer;
      border-radius: 3px;
      &:hover {
        color: #fff;
        background: #e6202f;
        border-color: #e61932;
      }
    }
  }
}
.max_img_panel {
  position: relative;
  z-index: 1000;
  .img_panel {
    display: table;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .img_box {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }
  .img {
    display: inline-block;
    position: relative;
    max-width: 80%;
    i {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 9;
      font-size: 30px;
      cursor: pointer;
      &:hover {
        color: #e00;
      }
    }
  }
}
</style>
