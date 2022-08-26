<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :auto-start="false"
      :options="options"
      class="uploader-app"
      @upload-start="onBeforeFileUpload"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
    >
      <uploader-unsupport/>
      <uploader-btn id="global-uploader-btn" ref="uploadBtn" :attrs="attrs">选择文件</uploader-btn>
      <uploader-list v-show="panelShow">
        <div slot-scope="props" :class="{'collapse': collapse}" class="file-panel">
          <div class="file-title">
            <h5>上传列表</h5>
            <div class="operate">
              <el-button :title="collapse ? '展开':'折叠' " type="text" @click="fileListShow">
                <i :class="collapse ? 'el-icon-copy-document': 'el-icon-minus'" class=""/>
              </el-button>
              <el-button title="关闭" type="text" @click="close">
                <i class="el-icon-close"/>
              </el-button>
            </div>
          </div>
          <ul class="file-list upload_file_list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file
                ref="files"
                :class="'upload_file_item file_' + file.id"
                :file="file"
                :list="true"
              />
            </li>
            <div v-if="!props.fileList.length" class="no-file"><i class="iconfont icon-empty-file"/> 暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
 *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
 *           Bus.$on('fileSuccess', fn); 文件上传成功的回调
 */
// import {ACCEPT_CONFIG} from './js/config';
import Bus from '@/utils/bus';
import SparkMD5 from 'spark-md5';

import {getToken} from '@/utils/auth';
import {Message} from 'element-ui';

export default {
  components: {},
  data() {
    return {
      options: {
        target: process.env.VUE_APP_BASE_API + '/v1/video/upload',
        chunkSize: '2048000',
        fileParameterName: 'file',
        maxChunkRetries: 3,
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function (chunk, message) {
          const objMessage = JSON.parse(message);
          if (objMessage.code !== 200) {
            Message.error(objMessage.msg)
          }
          if (objMessage.data.uploadStatus === 1) {
            return true;
          }
          return (objMessage.data.uploads || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          token: getToken()
          // Authorization: Ticket.get() && "Bearer " + Ticket.get().access_token
        },
        query() {
          true
        }
      },
      fileTypeInt: {'video': 1, 'audio': 2, 'pdf': 3, 'application': 3, 'image': 7},
      attrs: {
        accept: '.mp4'
      },
      panelShow: false, // 选择文件后，展示上传panel
      collapse: false,
      limitFileSize: 5 * 1024 * 1024 * 1024
    }
  },
  computed: {
    // Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  watch: {},
  mounted() {
    Bus.$on('openUploader', query => {
      this.params = query || {accept: '.mp4,.mp3,.pdf'};
      this.attrs.accept = this.params.accept
      if (this.$refs.uploadBtn) {
        const btn = document.getElementById('global-uploader-btn')
        btn.children[0].accept = this.attrs.accept
        delete this.params.accept
        btn.click()
      }
    });
  },
  destroyed() {
    Bus.$off('openUploader');
  },
  methods: {
    onBeforeFileUpload(file) {
      if (file.size > this.limitFileSize) {
        this.$message.error('文件的大小不能超过5GB');
        return false;
      }
    },
    onFileAdded(file) {
      this.panelShow = true;
      this.computeMD5(file);
      Bus.$emit('fileAdded');
    },
    onFileProgress(rootFile, file, chunk) {
      this.statusSet(file.id, 'progress');
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      const res = JSON.parse(response);
      this.statusSet(file.id, 'success');
      if (res.code === 200) {
        // console.log(file)
      } else {
        this.statusSet(file.id, 'error');
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    onFileError(rootFile, file, response, chunk) {
      this.statusSet(file.id, 'error');
      this.$message({
        message: response,
        type: 'error'
      })
    },

    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      const fileReader = new FileReader();
      const time = new Date().getTime();
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1000;
      const chunks = Math.ceil(file.size / chunkSize);
      const spark = new SparkMD5.ArrayBuffer();
      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5');
      file.pause();
      loadNext();
      fileReader.onload = e => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            // $(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
          })
        } else {
          const md5 = spark.end();
          this.computeMD5Success(md5, file);
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
        }
      };

      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel();
      };

      function loadNext() {
        const start = currentChunk * chunkSize;
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },

    computeMD5Success(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })

      file.uniqueIdentifier = md5;
      file.resume();
      this.statusRemove(file.id);
    },

    fileListShow() {
      this.collapse = !this.collapse;
    },
    close() {
      this.uploader.cancel();
      this.panelShow = false;
    },

    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#4E6EF2'
        },
        merging: {
          text: '合并中',
          bgc: '#4E6EF2'
        },
        transcoding: {
          text: '转码中',
          bgc: '#4E6EF2'
        },
        failed: {
          text: '上传失败',
          bgc: '#4E6EF2 '
        },
        success: {
          text: '上传成功',
          bgc: '#77D44F'
        },
        progress: {
          text: '正在上传',
          bgc: '#e2eeff'
        },
        error: {
          text: '上传错误',
          bgc: '#C3190F'
        }
      }
      this.$nextTick(() => {
        const box = document.getElementsByClassName(`file_${id}`)[0]
        box.getElementsByClassName('uploader-file-status')
        const $p = document.createElement('span')
        $p.innerText = statusMap[status].text
        $p.style.color = statusMap[status].bgc
        box.querySelector('.uploader-file-status').innerHTML = ''
        box.querySelector('.uploader-file-status').appendChild($p)
        // $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
        //   'position': 'absolute',
        //   'top': '0',
        //   'left': '0',
        //   'right': '0',
        //   'bottom': '0',
        //   'zIndex': '1',
        //   'backgroundColor': statusMap[status].bgc
        // }).text(statusMap[status].text);
      })
    },
    statusRemove(id) {
      this.$nextTick(() => {
        // $(`.myStatus_${id}`).remove();
      })
    },

    error(msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#global-uploader {
  position: fixed;
  z-index: 6666;
  right: 15px;
  bottom: 15px;

  .file-panel {
    width: 520px;
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);

    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;

      h5 {
        height: 100%;
        margin: 0;
      }

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-left: 0;
      margin: 0;
      background-color: #fff;

      > li {
        background-color: #fff;
      }

      > li {
        list-style-type: none;
      }
    }

    &.collapse {
      width: 200px;

      .file-title {
        background-color: #E7ECF2;
      }

      .file-list {
        display: none;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  /deep/ .uploader-file-icon {
    &:before {
      content: '' !important;
    }

    &[icon=image] {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjkyNTMgMi45MjUzOUMxNy45MjUzIDEuNzkxMzkgMTcuMTAzNyAwLjkwMDM5MSAxNi4wNTgxIDAuOTAwMzkxSDEuODY3MjJDMC44MjE1NzcgMC45MDAzOTEgMCAxLjc5MTM5IDAgMi45MjUzOVYxNS4wNzU0QzAgMTUuMjM3NCAwIDE1LjMxODQgMC4wNzQ2ODg4IDE1LjQ4MDRDMC4yMjQwNjYgMTYuMzcxNCAwLjk3MDk1NCAxNy4xMDA0IDEuODY3MjIgMTcuMTAwNEgxNi41MDYyQzE2LjU4MDkgMTcuMTAwNCAxNi42NTU2IDE3LjAxOTQgMTYuNzMwMyAxNy4wMTk0QzE2LjczMDMgMTcuMDE5NCAxNi44MDUgMTcuMDE5NCAxNi44MDUgMTYuOTM4NEMxNi44Nzk3IDE2LjkzODQgMTYuOTU0NCAxNi44NTc0IDE3LjAyOSAxNi43NzY0QzE3LjAyOSAxNi43NzY0IDE3LjEwMzcgMTYuNzc2NCAxNy4xMDM3IDE2LjY5NTRDMTcuMTc4NCAxNi42MTQ0IDE3LjI1MzEgMTYuNjE0NCAxNy4zMjc4IDE2LjUzMzRMMTcuNDAyNSAxNi40NTI0QzE3LjQ3NzIgMTYuMzcxNCAxNy40NzcyIDE2LjI5MDQgMTcuNTUxOSAxNi4yMDk0TDE3LjYyNjYgMTYuMTI4NEMxNy43MDEyIDE2LjA0NzQgMTcuNzAxMiAxNS45NjY0IDE3Ljc3NTkgMTUuODg1NEMxNy44NTA2IDE1LjgwNDQgMTcuODUwNiAxNS42NDI0IDE3LjkyNTMgMTUuNTYxNFYxNS40ODA0QzE3LjkyNTMgMTUuMzE4NCAxOCAxNS4xNTY0IDE4IDE0Ljk5NDRWMi45MjUzOUgxNy45MjUzWk0xLjg2NzIyIDIuNTIwMzlIMTYuMDU4MUMxNi4yODIyIDIuNTIwMzkgMTYuNDMxNSAyLjY4MjM5IDE2LjQzMTUgMi45MjUzOVYxMS45OTc0TDEyLjAyNDkgNy41NDIzOUMxMS43MjYxIDcuMjE4MzkgMTEuMjc4IDcuMjE4MzkgMTAuOTc5MyA3LjU0MjM5TDcuMDk1NDQgMTEuNzU0NEw1LjMwMjkgOS44MTAzOUM1LjAwNDE1IDkuNDg2MzkgNC42MzA3IDkuNDg2MzkgNC4zMzE5NSA5LjcyOTM5TDEuNDkzNzggMTIuMzIxNFYyLjkyNTM5QzEuNDkzNzggMi42ODIzOSAxLjY0MzE1IDIuNTIwMzkgMS44NjcyMiAyLjUyMDM5WiIgZmlsbD0iIzBGQjQ4QyIvPgo8cGF0aCBkPSJNMy41OTk2MSA2LjNDMy41OTk1OSA2LjUzNjM3IDMuNjQ2MTMgNi43NzA0MyAzLjczNjU4IDYuOTg4ODJDMy44MjcwMyA3LjIwNzIgMy45NTk2MSA3LjQwNTYzIDQuMTI2NzYgNy41NzI3OEM0LjI5MzkxIDcuNzM5OTMgNC40OTIzNCA3Ljg3MjUyIDQuNzEwNzQgNy45NjI5OEM0LjkyOTE0IDguMDUzNDQgNS4xNjMyMiA4LjEgNS4zOTk2MSA4LjFDNS42MzYgOC4xIDUuODcwMDggOC4wNTM0NCA2LjA4ODQ4IDcuOTYyOThDNi4zMDY4NyA3Ljg3MjUyIDYuNTA1MzEgNy43Mzk5MyA2LjY3MjQ2IDcuNTcyNzhDNi44Mzk2MSA3LjQwNTYzIDYuOTcyMTkgNy4yMDcyIDcuMDYyNjQgNi45ODg4MkM3LjE1MzA5IDYuNzcwNDMgNy4xOTk2MyA2LjUzNjM3IDcuMTk5NjEgNi4zQzcuMTk5NjMgNi4wNjM2MyA3LjE1MzA5IDUuODI5NTcgNy4wNjI2NCA1LjYxMTE4QzYuOTcyMTkgNS4zOTI4IDYuODM5NjEgNS4xOTQzNyA2LjY3MjQ2IDUuMDI3MjJDNi41MDUzMSA0Ljg2MDA3IDYuMzA2ODcgNC43Mjc0OCA2LjA4ODQ4IDQuNjM3MDJDNS44NzAwOCA0LjU0NjU2IDUuNjM2IDQuNSA1LjM5OTYxIDQuNUM1LjE2MzIyIDQuNSA0LjkyOTE0IDQuNTQ2NTYgNC43MTA3NCA0LjYzNzAyQzQuNDkyMzQgNC43Mjc0OCA0LjI5MzkxIDQuODYwMDcgNC4xMjY3NiA1LjAyNzIyQzMuOTU5NjEgNS4xOTQzNyAzLjgyNzAzIDUuMzkyOCAzLjczNjU4IDUuNjExMThDMy42NDYxMyA1LjgyOTU3IDMuNTk5NTkgNi4wNjM2MyAzLjU5OTYxIDYuM1oiIGZpbGw9IiMwRkI0OEMiLz4KPC9zdmc+Cg==');
      background-size: contain;
    }

    &[icon=video] {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjY4NzUgMTkuOTA0M0gzLjQzNzVDMy4xMDU5OCAxOS45MDQzIDIuNzg4MDQgMTkuNzcyNiAyLjU1MzYyIDE5LjUzODJDMi4zMTkyIDE5LjMwMzggMi4xODc1IDE4Ljk4NTggMi4xODc1IDE4LjY1NDNWMS40MDQzQzIuMTg3NSAxLjA3Mjc4IDIuMzE5MiAwLjc1NDgzNCAyLjU1MzYyIDAuNTIwNDEzQzIuNzg4MDQgMC4yODU5OTMgMy4xMDU5OCAwLjE1NDI5NyAzLjQzNzUgMC4xNTQyOTdIMTMuMDIyNUwxNy45NCA1LjMyMThWMTguNjU0M0MxNy45NCAxOC44MTg3IDE3LjkwNzYgMTguOTgxNCAxNy44NDQ2IDE5LjEzMzJDMTcuNzgxNiAxOS4yODUxIDE3LjY4OTMgMTkuNDIzIDE3LjU3MyAxOS41MzkxQzE3LjQ1NjcgMTkuNjU1MiAxNy4zMTg2IDE5Ljc0NzIgMTcuMTY2NiAxOS44MDk5QzE3LjAxNDcgMTkuODcyNSAxNi44NTE5IDE5LjkwNDYgMTYuNjg3NSAxOS45MDQzWiIgZmlsbD0iIzgxODNGMSIvPgo8cGF0aCBvcGFjaXR5PSIwLjQiIGQ9Ik0xMy4wMjIgMC4xNTQyOTdMMTIuOTM5NSA0LjE1NDNDMTIuOTM5NSA0LjMxODQ1IDEyLjk3MTggNC40ODA5OSAxMy4wMzQ2IDQuNjMyNjVDMTMuMDk3NCA0Ljc4NDMxIDEzLjE4OTUgNC45MjIxMSAxMy4zMDU2IDUuMDM4MThDMTMuNTQgNS4yNzI2IDEzLjg1NzkgNS40MDQzIDE0LjE4OTUgNS40MDQzTDE3LjkzOTUgNS4zMjE4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTEuMTIyNSA4LjkwODJINi4xMjc1QzUuOTE5MDEgOC45MDgyIDUuNzUgOS4wNzcyMiA1Ljc1IDkuMjg1N1YxMy4yODA3QzUuNzUgMTMuNDg5MiA1LjkxOTAxIDEzLjY1ODIgNi4xMjc1IDEzLjY1ODJIMTEuMTIyNUMxMS4zMzEgMTMuNjU4MiAxMS41IDEzLjQ4OTIgMTEuNSAxMy4yODA3VjkuMjg1N0MxMS41IDkuMDc3MjIgMTEuMzMxIDguOTA4MiAxMS4xMjI1IDguOTA4MloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMy40NCA5LjIwNjc3TDEyLjEwMjUgOS45NzE3N0MxMi4wNzEzIDkuOTg5NzYgMTIuMDQ1NSAxMC4wMTU2IDEyLjAyNzUgMTAuMDQ2OEMxMi4wMDk1IDEwLjA3NzkgMTIgMTAuMTEzMyAxMiAxMC4xNDkzVjEyLjM5OTNDMTIgMTIuNDM1MyAxMi4wMDk1IDEyLjQ3MDYgMTIuMDI3NSAxMi41MDE4QzEyLjA0NTUgMTIuNTMyOSAxMi4wNzEzIDEyLjU1ODggMTIuMTAyNSAxMi41NzY4TDEzLjQ0IDEzLjM0MThDMTMuNDcwNiAxMy4zNTkzIDEzLjUwNTIgMTMuMzY4NyAxMy41NDA1IDEzLjM2OTFDMTMuNTc1NyAxMy4zNjk1IDEzLjYxMDUgMTMuMzYwOSAxMy42NDE1IDEzLjM0NDFDMTMuNjcyNiAxMy4zMjc0IDEzLjY5ODggMTMuMzAzIDEzLjcxNzggMTMuMjczM0MxMy43MzY3IDEzLjI0MzUgMTMuNzQ3OCAxMy4yMDk1IDEzLjc1IDEzLjE3NDNWOS4zODY3N0MxMy43NDk5IDkuMzUwNTEgMTMuNzQwMyA5LjMxNDg5IDEzLjcyMjIgOS4yODM0OEMxMy43MDQxIDkuMjUyMDcgMTMuNjc4MSA5LjIyNTk1IDEzLjY0NjcgOS4yMDc3NEMxMy42MTUzIDkuMTg5NTMgMTMuNTc5NyA5LjE3OTg2IDEzLjU0MzUgOS4xNzk2OUMxMy41MDcyIDkuMTc5NTIgMTMuNDcxNSA5LjE4ODg2IDEzLjQ0IDkuMjA2NzdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');
      background-size: contain;
    }

    &[icon=audio] {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjY4NzUgMTkuOTA0M0gzLjQzNzVDMy4xMDU5OCAxOS45MDQzIDIuNzg4MDQgMTkuNzcyNiAyLjU1MzYyIDE5LjUzODJDMi4zMTkyIDE5LjMwMzggMi4xODc1IDE4Ljk4NTggMi4xODc1IDE4LjY1NDNWMS40MDQzQzIuMTg3NSAxLjA3Mjc4IDIuMzE5MiAwLjc1NDgzNCAyLjU1MzYyIDAuNTIwNDEzQzIuNzg4MDQgMC4yODU5OTMgMy4xMDU5OCAwLjE1NDI5NyAzLjQzNzUgMC4xNTQyOTdIMTMuMDIyNUwxNy45NCA1LjMyMThWMTguNjU0M0MxNy45NCAxOC44MTg3IDE3LjkwNzYgMTguOTgxNCAxNy44NDQ2IDE5LjEzMzJDMTcuNzgxNiAxOS4yODUxIDE3LjY4OTMgMTkuNDIzIDE3LjU3MyAxOS41MzkxQzE3LjQ1NjcgMTkuNjU1MiAxNy4zMTg2IDE5Ljc0NzIgMTcuMTY2NiAxOS44MDk5QzE3LjAxNDcgMTkuODcyNSAxNi44NTE5IDE5LjkwNDYgMTYuNjg3NSAxOS45MDQzWiIgZmlsbD0iI0YwNDNBMCIvPgo8cGF0aCBvcGFjaXR5PSIwLjQiIGQ9Ik0xMy4wMjIgMC4xNTQyOTdMMTIuOTM5NSA0LjE1NDNDMTIuOTM5NSA0LjMxODQ1IDEyLjk3MTggNC40ODA5OSAxMy4wMzQ2IDQuNjMyNjVDMTMuMDk3NCA0Ljc4NDMxIDEzLjE4OTUgNC45MjIxMSAxMy4zMDU2IDUuMDM4MThDMTMuNTQgNS4yNzI2IDEzLjg1NzkgNS40MDQzIDE0LjE4OTUgNS40MDQzTDE3LjkzOTUgNS4zMjE4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuNjM0IDcuMDUxNkw5LjIxNTUyIDguMDk3NDVDOC44MDEzNyA4LjIxNTYgOC40NjU2OCA4LjY0NzYxIDguNDY1NjggOS4wNjE3NlYxMi42Njc2QzguNDY1NjggMTIuNjY3NiA4LjIxNzk4IDEyLjUwMDUgNy42NjYzIDEyLjU3ODdDNi44NTYxNCAxMi42OTM4IDYuMTk5MjIgMTMuMzE1NiA2LjE5OTIyIDEzLjk2NzlDNi4xOTkyMiAxNC42MjAyIDYuODU2MTQgMTUuMDE5OSA3LjY2NjMgMTQuOTA0OEM4LjQ3NzA2IDE0Ljc5MDQgOS4wNzEyMiAxNC4xODc2IDkuMDcxMjIgMTMuNTM1VjEwLjQ1NjJDOS4wNzEyMiAxMC4xNjcgOS40MTg5MSAxMC4wNDMgOS40MTg5MSAxMC4wNDNMMTIuNDQxNCA5LjA5NTZDMTIuNDQxNCA5LjA5NTYgMTIuNzc1OCA4Ljk4MzI5IDEyLjc3NTggOS4yOTI4M1YxMS43NjU4QzEyLjc3NTggMTEuNzY1OCAxMi40Njc4IDExLjU4ODUgMTEuOTE2MSAxMS42NTU2QzExLjEwNiAxMS43NTM4IDEwLjQ0OTEgMTIuMzYyNyAxMC40NDkxIDEzLjAxNDdDMTAuNDQ5MSAxMy42NjczIDExLjEwNiAxNC4wODAyIDExLjkxNjEgMTMuOTgxOEMxMi43MjY5IDEzLjg4MzYgMTMuMzgzOCAxMy4yNzUgMTMuMzgzOCAxMi42MjI0VjcuNTg3NjFDMTMuMzgzOCA3LjE3MzQ1IDEzLjA0NzggNi45MzM0NSAxMi42MzQgNy4wNTE2SDEyLjYzNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=');
      background-size: contain;
    }

    &[icon=document] {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2Ljc1IDE5Ljg3NUgzLjVDMy4xNjg0OCAxOS44NzUgMi44NTA1NCAxOS43NDMzIDIuNjE2MTIgMTkuNTA4OUMyLjM4MTcgMTkuMjc0NSAyLjI1IDE4Ljk1NjUgMi4yNSAxOC42MjVWMS4zNzVDMi4yNSAxLjA0MzQ4IDIuMzgxNyAwLjcyNTUzNyAyLjYxNjEyIDAuNDkxMTE2QzIuODUwNTQgMC4yNTY2OTYgMy4xNjg0OCAwLjEyNSAzLjUgMC4xMjVIMTMuMDc1TDE4IDUuMjkyNVYxOC42MjI1QzE4LjAwMDMgMTguNzg2OSAxNy45NjgyIDE4Ljk0OTcgMTcuOTA1NiAxOS4xMDE2QzE3Ljg0MjkgMTkuMjUzNiAxNy43NTA5IDE5LjM5MTcgMTcuNjM0OCAxOS41MDhDMTcuNTE4NyAxOS42MjQzIDE3LjM4MDcgMTkuNzE2NiAxNy4yMjg5IDE5Ljc3OTZDMTcuMDc3MSAxOS44NDI2IDE2LjkxNDQgMTkuODc1IDE2Ljc1IDE5Ljg3NVoiIGZpbGw9IiNGRTY0NjQiLz4KPHBhdGggb3BhY2l0eT0iMC40IiBkPSJNMTMuMDIyIDAuMTI1TDEyLjkzOTUgNC4xMjVDMTIuOTM5NSA0LjQ1NjUyIDEzLjA3MTEgNC43NzQ0NiAxMy4zMDU2IDUuMDA4ODhDMTMuNTQgNS4yNDMzIDEzLjg1NzkgNS4zNzUgMTQuMTg5NSA1LjM3NUwxNy45Mzk0IDUuMjkyNSIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTUuMzg5OTYgMTMuMDQyOUM1LjMxNjYxIDEzLjA0MzUgNS4yNDU4NyAxMy4wMTU3IDUuMTkyNDYgMTIuOTY1NEM1LjE2NTQ3IDEyLjk0MTcgNS4xNDM5MSAxMi45MTI1IDUuMTI5MjUgMTIuODc5N0M1LjExNDU4IDEyLjg0NjkgNS4xMDcxNSAxMi44MTEzIDUuMTA3NDYgMTIuNzc1NFY4Ljc3NTQzQzUuMTA2ODMgOC43Mzk3IDUuMTEzODcgOC43MDQyNiA1LjEyODExIDguNjcxNDhDNS4xNDIzNCA4LjYzODcxIDUuMTYzNDMgOC42MDkzNiA1LjE4OTk2IDguNTg1NDNDNS4yNDI2IDguNTM1NTIgNS4zMTI0MiA4LjUwNzc3IDUuMzg0OTYgOC41MDc5M0g2Ljk4NDk2QzcuMTU3MDggOC41MDU1MyA3LjMyNzY3IDguNTQwNSA3LjQ4NDk2IDguNjEwNDNDNy42MzMxMyA4LjY3OTQ3IDcuNzY4NDEgOC43NzMzMiA3Ljg4NDk2IDguODg3OTNDOC4wMDUzNCA5LjAwMjUxIDguMTAwMSA5LjE0MTI4IDguMTYzMDEgOS4yOTUxQzguMjI1OTIgOS40NDg5MyA4LjI1NTU1IDkuNjE0MzMgOC4yNDk5NiA5Ljc4MDQzQzguMjUyOTIgOS45NTE4NCA4LjIyMDU4IDEwLjEyMiA4LjE1NDk2IDEwLjI4MDRDOC4wOTI0IDEwLjQzMjQgNy45OTk3IDEwLjU3MDIgNy44ODI0NiAxMC42ODU0QzcuNzY4ODkgMTAuODAxMiA3LjYzMzg4IDEwLjg5MzcgNy40ODQ5NiAxMC45NTc5QzcuMzI3MDYgMTEuMDI1NCA3LjE1NjY0IDExLjA1ODYgNi45ODQ5NiAxMS4wNTU0SDUuNjYyNDZWMTIuNzc1NEM1LjY2MzQgMTIuODExIDUuNjU2NzUgMTIuODQ2MyA1LjY0Mjk2IDEyLjg3OTFDNS42MjkxNiAxMi45MTE4IDUuNjA4NTQgMTIuOTQxMyA1LjU4MjQ2IDEyLjk2NTRDNS41NTcxNSAxMi45OTA1IDUuNTI3MDkgMTMuMDEwMyA1LjQ5NDAzIDEzLjAyMzZDNS40NjA5NyAxMy4wMzY5IDUuNDI1NTkgMTMuMDQzNSA1LjM4OTk2IDEzLjA0MjlaTTUuNjYyNDYgMTAuNTAwNEg2Ljk5OTk2QzcuMDkzOTYgMTAuNTAzNCA3LjE4NzQ2IDEwLjQ4NTYgNy4yNzM4NSAxMC40NDg1QzcuMzYwMjUgMTAuNDExMyA3LjQzNzQzIDEwLjM1NTcgNy40OTk5NiAxMC4yODU0QzcuNTY5MzcgMTAuMjE5NiA3LjYyNDMzIDEwLjE0IDcuNjYxMzQgMTAuMDUxOEM3LjY5ODM2IDkuOTYzNTUgNy43MTY2MSA5Ljg2ODU5IDcuNzE0OTYgOS43NzI5M0M3LjcxNzI0IDkuNjc1NyA3LjY5OTMxIDkuNTc5MDUgNy42NjIzMSA5LjQ4OTExQzcuNjI1MyA5LjM5OTE3IDcuNTcwMDEgOS4zMTc4OSA3LjQ5OTk2IDkuMjUwNDNDNy40MzcwMSA5LjE4MDcxIDcuMzU5NzQgOS4xMjU0MSA3LjI3MzQ1IDkuMDg4MzFDNy4xODcxNSA5LjA1MTIgNy4wOTM4NyA5LjAzMzE2IDYuOTk5OTYgOS4wMzU0M0g1LjY3NDk2TDUuNjYyNDYgMTAuNTAwNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik05Ljk2OTQ4IDguNTE5MzlDMTAuMjY4NiA4LjUxODEgMTAuNTY0OCA4LjU3ODUyIDEwLjgzOTUgOC42OTY4OUMxMS4zNzk5IDguOTMwNTEgMTEuODEwOCA5LjM2MTQ3IDEyLjA0NDUgOS45MDE4OUMxMi4xNjI1IDEwLjE3ODUgMTIuMjIzMyAxMC40NzYxIDEyLjIyMzMgMTAuNzc2OUMxMi4yMjMzIDExLjA3NzYgMTIuMTYyNSAxMS4zNzUzIDEyLjA0NDUgMTEuNjUxOUMxMS45MjUzIDExLjkyMDkgMTEuNzU1NiAxMi4xNjQ1IDExLjU0NDUgMTIuMzY5NEMxMS4zMzgzIDEyLjU4MTYgMTEuMDkxNCAxMi43NSAxMC44MTg3IDEyLjg2NDdDMTAuNTQ1OSAxMi45Nzk0IDEwLjI1MjkgMTMuMDM4IDkuOTU2OTggMTMuMDM2OUg5LjEyNjk4QzkuMDkxMzggMTMuMDM5MSA5LjA1NTcyIDEzLjAzMzcgOS4wMjIzOSAxMy4wMjFDOC45ODkwNSAxMy4wMDgzIDguOTU4ODIgMTIuOTg4NyA4LjkzMzcyIDEyLjk2MzNDOC45MDg2MiAxMi45MzggOC44ODkyMyAxMi45MDc2IDguODc2ODYgMTIuODc0MUM4Ljg2NDQ4IDEyLjg0MDcgOC44NTk0MSAxMi44MDUgOC44NjE5OCAxMi43Njk0VjguNzY5MzlDOC44NTk3OCA4LjczNDAyIDguODY1MTMgOC42OTg1OCA4Ljg3NzY3IDguNjY1NDNDOC44OTAyMiA4LjYzMjI5IDguOTA5NjYgOC42MDIxOSA4LjkzNDcyIDguNTc3MTNDOC45NTk3OCA4LjU1MjA3IDguOTg5ODggOC41MzI2MiA5LjAyMzAzIDguNTIwMDhDOS4wNTYxNyA4LjUwNzU0IDkuMDkxNiA4LjUwMjE5IDkuMTI2OTggOC41MDQzOUw5Ljk2OTQ4IDguNTE5MzlaTTExLjE4OTUgMTEuOTk5NEMxMS4zNDY1IDExLjg0MjYgMTEuNDcxMyAxMS42NTY2IDExLjU1NyAxMS40NTE5QzExLjY0NzcgMTEuMjM5NCAxMS42OTM2IDExLjAxMDQgMTEuNjkyIDEwLjc3OTRDMTEuNjkzMiAxMC41NDc5IDExLjY0NTQgMTAuMzE4NyAxMS41NTIgMTAuMTA2OUMxMS4zNzM5IDkuNjk1NTEgMTEuMDQ1OSA5LjM2NzQyIDEwLjYzNDUgOS4xODkzOUMxMC40MjQxIDkuMTAwNDggMTAuMTk3OCA5LjA1NTM5IDkuOTY5NDggOS4wNTY4OUg5LjM5NDQ4VjEyLjQ5OTRIOS45Njk0OEMxMC4yIDEyLjUwMTQgMTAuNDI4NCAxMi40NTQ1IDEwLjYzOTUgMTIuMzYxOUMxMC44NDM3IDEyLjI3NjEgMTEuMDMwMSAxMi4xNTMyIDExLjE4OTUgMTEuOTk5NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNC4yNzc0IDkuMDgzNDVDMTQuMTU4NSA5LjA4MjExIDE0LjA0MDYgOS4xMDUxNSAxMy45MzA5IDkuMTUxMTZDMTMuODIxMyA5LjE5NzE3IDEzLjcyMjIgOS4yNjUxNyAxMy42Mzk5IDkuMzUwOTVDMTMuNTUyMyA5LjQzMTI4IDEzLjQ4MzMgOS41Mjk2NyAxMy40Mzc2IDkuNjM5MzFDMTMuMzkxOCA5Ljc0ODk1IDEzLjM3MDQgOS44NjcyMyAxMy4zNzQ5IDkuOTg1OTVWMTIuNzUxQzEzLjM3NDkgMTIuODIxOSAxMy4zNDY3IDEyLjg4OTkgMTMuMjk2NSAxMi45NDAxQzEzLjI0NjQgMTIuOTkwMyAxMy4xNzgzIDEzLjAxODUgMTMuMTA3NCAxMy4wMTg1QzEzLjAzNjQgMTMuMDE4NSAxMi45Njg0IDEyLjk5MDMgMTIuOTE4MiAxMi45NDAxQzEyLjg2ODEgMTIuODg5OSAxMi44Mzk5IDEyLjgyMTkgMTIuODM5OSAxMi43NTFWMTAuMDAxQzEyLjgzODUgOS44MDkzNCAxMi44NzY4IDkuNjE5NTIgMTIuOTUyNCA5LjQ0MzQ1QzEzLjAxOTkgOS4yNjgxMSAxMy4xMjA5IDkuMTA3NjEgMTMuMjQ5OSA4Ljk3MDk1QzEzLjM4MTkgOC44MzUzNSAxMy41NDAzIDguNzI4MTYgMTMuNzE1MyA4LjY1NTk0QzEzLjg5MDIgOC41ODM3MiAxNC4wNzgxIDguNTQ3OTkgMTQuMjY3NCA4LjU1MDk1SDE1LjI2NzRDMTUuMzMzNSA4LjU1NzM3IDE1LjM5NDkgOC41ODgxOSAxNS40Mzk2IDguNjM3NDFDMTUuNDg0MyA4LjY4NjY0IDE1LjUwOSA4Ljc1MDczIDE1LjUwOSA4LjgxNzJDMTUuNTA5IDguODgzNjcgMTUuNDg0MyA4Ljk0Nzc3IDE1LjQzOTYgOC45OTY5OUMxNS4zOTQ5IDkuMDQ2MjEgMTUuMzMzNSA5LjA3NzAzIDE1LjI2NzQgOS4wODM0NUgxNC4yNzc0Wk0xNS4yNzc0IDEwLjMzMzVDMTUuMzI5OCAxMC4zMzQxIDE1LjM4MDkgMTAuMzUwMSAxNS40MjQzIDEwLjM3OTZDMTUuNDY3NyAxMC40MDkgMTUuNTAxNSAxMC40NTA1IDE1LjUyMTQgMTAuNDk5QzE1LjU0MTQgMTAuNTQ3NSAxNS41NDY3IDEwLjYwMDggMTUuNTM2NiAxMC42NTIyQzE1LjUyNjYgMTAuNzAzNyAxNS41MDE2IDEwLjc1MTEgMTUuNDY0OSAxMC43ODg1QzE1LjQ0MDggMTAuODEzOCAxNS40MTE2IDEwLjgzMzcgMTUuMzc5MyAxMC44NDcxQzE1LjM0NyAxMC44NjA0IDE1LjMxMjMgMTAuODY2OSAxNS4yNzc0IDEwLjg2NkgxNC4wMjc0QzEzLjk5MiAxMC44NjcyIDEzLjk1NjggMTAuODYxIDEzLjkyNDEgMTAuODQ3NkMxMy44OTEzIDEwLjgzNDIgMTMuODYxOCAxMC44MTQxIDEzLjgzNzQgMTAuNzg4NUMxMy44MTAzIDEwLjc2NTMgMTMuNzg4NCAxMC43MzY1IDEzLjc3MzMgMTAuNzA0MkMxMy43NTgyIDEwLjY3MTggMTMuNzUwMiAxMC42MzY2IDEzLjc0OTkgMTAuNjAxQzEzLjc0NzYgMTAuNTY1NCAxMy43NTMxIDEwLjUyOTcgMTMuNzY1NyAxMC40OTY0QzEzLjc3ODQgMTAuNDYzIDEzLjc5ODEgMTAuNDMyOCAxMy44MjM0IDEwLjQwNzdDMTMuODQ4OCAxMC4zODI2IDEzLjg3OTIgMTAuMzYzMiAxMy45MTI2IDEwLjM1MDhDMTMuOTQ2MSAxMC4zMzg1IDEzLjk4MTggMTAuMzMzNCAxNC4wMTc0IDEwLjMzNkwxNS4yNzc0IDEwLjMzMzVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');
      background-size: contain;
    }
  }

  /deep/ .uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
