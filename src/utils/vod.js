import {ElMessage} from 'element-plus'
import {default as PlvVideoUpload} from '@polyv/vod-upload-js-sdk';
import {saveResource, vodConfig} from '../api/upload';

let polyvClient = {}

export function polyvUpload(file) {
  initPolyv();
  const fileSetting = {
    title: file.name, // 标题
    desc: '', // 描述
    cataid: 1, // 上传分类目录ID
    tag: '', // 标签
    luping: 1, // 是否开启视频课件优化处理，对于上传录屏类视频清晰度有所优化：0为不开启，1为开启
    keepsource: 0, // 是否源文件播放（不对视频进行编码）：0为编码，1为不编码
    state: '' // 用户自定义数据，如果提交了该字段，会在视频上传完成事件回调时透传返回。
  }
  const uploader = polyvClient.addFile(
    file, // file 为待上传的文件对象
    {
      FileStarted: function(uploadInfo) { // 文件开始上传回调
        //console.log('开始')
      },
      FileProgress: function(uploadInfo) { // 文件上传过程返回上传进度信息回调
        //console.log('过程')
      },
      FileStopped: function(uploadInfo) { // 文件暂停上传回调
        //console.log('暂停')
      },
      FileSucceed: function(uploadInfo) { // 文件上传成功回调
        //console.log(uploadInfo)
        const resource = {resourceName: uploadInfo.fileData.filename, resourceSize: uploadInfo.fileData.filesize, videoVid: uploadInfo.fileData.vid}
        saveResource(resource);
      },
      FileFailed: function(uploadInfo) { // 文件上传失败回调
        console.error(uploadInfo)
        //ElMessage.error(uploadInfo);
      }
    },
    fileSetting
  );
  //console.log(uploader)
}

export function initPolyv() {
  getPolyvVideoSign()
  polyvClient = new PlvVideoUpload({
    events: {
      Error: (err) => {
        console.log(err);
        ElMessage.error(err.message);
      },
      UploadComplete: () => {
        // 全部上传任务完成回调
      }
    }
  });
}

export function getPolyvVideoSign() {
  vodConfig().then(res => {
    //console.log(res)
    polyvClient.updateUserData({
      userid: res.polyvConfig.userid,
      ptime: res.polyvConfig.ptime,
      sign: res.polyvConfig.sign,
      hash: res.polyvConfig.hash
    });
    // 更新用户数据（由于sign等用户信息有效期为3分钟，需要每隔3分钟更新一次）
    setTimeout(() => {
      getPolyvVideoSign()
    }, 1000 * 60 * 2)

    polyvClient.startAll();
  })
}
