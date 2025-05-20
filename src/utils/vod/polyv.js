import PlvVideoUpload from '@polyv/vod-upload-js-sdk'

export const getPolyvClient = (userData) => {
  //初始化上传实例
  const polyvClient = new PlvVideoUpload({
    region: 'auto',
    events: {
      Error: (err) => {
        // 错误事件回调
        console.error(err)
      },
      UploadComplete: () => {
        // 全部上传任务完成回调
      }
    }
  })
  // 设置账号授权验证信息
  polyvClient.updateUserData({
    userid: userData.userid,
    ptime: userData.ptime,
    hash: userData.hash,
    sign: userData.sign,
    cataid: userData.categoryId
  })
  return polyvClient
}

export const uploadPolyv = (polyvClient, startFile, callback) => {
  // 添加文件到文件
  polyvClient.addFile(
    startFile.file,
    {
      FileStarted: function (uploadInfo) {
        // 文件开始上传回调
        startFile.status = 'uploading'
        callback('FileStarted', uploadInfo)
      },
      FileProgress: function (uploadInfo) {
        // 文件上传过程返回上传进度信息回调
        callback('FileProgress', uploadInfo)
      },
      FileStopped: function (uploadInfo) {
        // 文件暂停上传回调
        callback('FileStopped', uploadInfo)
      },
      FileSucceed: function (uploadInfo) {
        // 文件上传成功回调
        callback('FileSucceed', uploadInfo)
      },
      FileFailed: function (uploadInfo) {
        // 文件上传失败回调
        callback('FileFailed', uploadInfo)
      }
    },
    {
      // 文件上传相关信息设置
      //title: file.name,  // 标题
      //desc: <desc>,  // 描述
      //cataid: startFile.categoryId, // 上传分类目录ID
      //tag: <tag>,  // 标签
      luping: 1, // 是否开启视频课件优化处理，对于上传录屏类视频清晰度有所优化：0为不开启，1为开启
      keepsource: 0 // 是否源文件播放（不对视频进行编码）：0为编码，1为不编码
      //state:<customMessage> //用户自定义信息，如果提交了该字段，会在服务端上传完成回调时透传返回。
    }
  )
  polyvClient.startAll()
}
