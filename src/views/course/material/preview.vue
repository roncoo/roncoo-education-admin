<template>
  <el-dialog v-model="modelValue" top="5vh" custom-class="preview_dialog" c :title="t('single.LearnTaskTimPreview')" :before-close="cloneDialog" :width="700" :append-to-body="true">
    <div class="video_body_content">
      <div class="video_content clearfix">
        <div class="win_box">
          <div v-if="ctrl.isVideo" id="player" ref="videoBox" class="video_win" />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cloneDialog">{{ t('close') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {useI18n} from 'vue-i18n';
import {computed, onMounted, onUnmounted, reactive, ref, toRefs, watch} from 'vue';
import {useStore} from 'vuex';
import {resourceLibraryPreview} from '@/api/course';
// import {jsonp} from 'vue-jsonp'
export default {
  name: 'Preview',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'image'
    },
    videoInfo: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, {emit}) {
    const {t} = useI18n()
    const { type, videoInfo, modelValue} = toRefs(props)
    const store = useStore()
    const videoBox = ref(null)
    const opts = reactive({
      imageList: '',
      video: {}
    })
    const map = reactive({
      player: null,
      userInfo: computed(() => {
        return store.state.user.userInfo
      })
    })
    const ctrl = reactive({
      isVideo: false,
      showImageViewer: true
    })
    const cloneDialog = () => {
      emit('update:modelValue', false)
    }
    const getView = () => {
      resourceLibraryPreview({id: videoInfo.value['id']}).then(res => {
        opts.video = res
        if (res.vodPlatform === 1 || res.vodPlatform === 4 || res.vodPlatform === 10) {
          play(res)
        } else if (res.vodPlatform === 2) {
          baiJiaYunPlay(res)
        }
      })
    }
    const baiJiaYunPlay = (data) => {
      console.log('baijiayun=>', data)
      const _that = map
      /* eslint-disable */
      $('#player').html('<video class="video video-js vjs-default-skin"></video>')
      const box = videoBox['value']
      if (data.watchProgress >= 100 || Math.abs(data.coursewareLengthInt - data.biggestWatchLength) < 3) {
        if (Math.abs(data.biggestWatchLength - data.lastWatchLength) < 3) {
          data.lastWatchLength = 0
        }
      }
      _that.player = new BjcPlayer(document.querySelector('.video'), {
        width: box.offsetWidth,
        height: box.offsetHeight,
        token: data.videoConfig,
        autoplay: false,
        currentTime: data.lastWatchDuration,
        vid: data.vid,
        playbackRates: [],
        showCurrentTimeDisplay: true,
        showDurationDisplay: true,
        disableSeek: 0, // 是否禁止拖拽， 0：可以， 1：禁止
        user_name: _that.userInfo.userName, // 用户名， 主要用于数据统计
        user_number: _that.userInfo.userNo, // 用户id， 主要用于数据统计
        onended: function () {
          console.log('onplayend event')
          // 视频播放结束清空保存记录定时器任务
        },
        onplay: function () {
          console.log('onplaybegin event')
        },
        onpause: function () {
          console.log('onplaypause event')
        },
        ontimeupdate: function (data) {
          console.log('ontimeupdate event')
        },
        onseeked: function (data) {
          console.log('onseek event')
          console.log('seekTime:' + data.currentTime)
        },
        onerror: function (data) {
          console.log('onerror event')
          console.log(data.msg)
        }
      })

      console.log('plater', _that.player)
    }
    const play = (data, startTime = 0) => {
      console.log('保利威播放', data)
      data.videoConfig = JSON.parse(data.videoConfig)
      window.s2j_onVideoPlay = () => {
      }

      window.s2j_onFullScreen = () => {
      }
      window.s2j_onNormalScreen = () => {
      }

      window.s2j_onPlayOver = () => {
        console.log('保利威播放结束！')

        // 视频播放结束清空保存记录定时器任务
      }
      window.s2j_onVideoPause = () => {
      }

      const box = videoBox['value']
      if (!box) {
        play(data, startTime)
        return
      }

      window.s2j_onPlayerInitOver = () => {
        // setTimeout(() => {
        //   map.player.j2s_seekVideo(data.lastWatchDuration)
        //   map.player.j2s_resumeVideo(data.lastWatchDuration)
        // }, 900)
      }
      if (map.player) {
        const param = {
          watchStartTime: startTime || 0,
          width: box.offsetWidth,
          height: box.offsetHeight,
          autoplay: false
        }
        if (data.vodPlatform === 4) {
          param.url = data.videoUrl
        } else if (data.vodPlatform === 10) {
          if (data.videoConfig.hdUrl) {
            param.url = data.videoConfig.hdUrl
          } else {
            param.url = data.videoConfig.sdUrl
          }
        } else {
          param.ts = data.videoConfig.ts;
          param.sign = data.videoConfig.sign;
          param.vid = data.videoConfig.vid;
          param.playsafe = data.videoConfig.token;
          param.code = data.videoConfig.code;
        }
        map.player.changeVid(param)
      } else {
        const param = {
          width: box.offsetWidth,
          height: box.offsetHeight,
          history_video_duration: 2,
          forceH5: true,
          hideSwitchPlayer: true,
          autoplay: false,
          speed: false,
          loading_bg_img: videoInfo.value['coverUrl'],
          watchStartTime: startTime,
          viewerInfo: {
            viewerId: map.userInfo.userNo,
            viewerName: map.userInfo.userName
          }
        }
        if (data.vodPlatform === 4) {
          param.url = data.videoUrl
        } else if (data.vodPlatform === 10) {
          if (data.videoConfig.hdUrl) {
            param.url = data.videoConfig.hdUrl
          } else {
            param.url = data.videoConfig.sdUrl
          }
        } else {
          param.ts = data.videoConfig.ts;
          param.sign = data.videoConfig.sign;
          param.vid = data.videoConfig.vid;
          param.playsafe = data.videoConfig.token;
          param.code = data.videoConfig.code
        }
        map.player = window.polyvObject('#player').videoPlayer(param)
      }
    }
    // const  {ctx} = getCurrentInstance()
    watch(() => modelValue.value, (val) => {
      if (val) {
        // jsonp('https://gateway.doityun.com/ip/info').then(res=>{
        //   opts.ipInfo = res
        // })
        ctrl.isVideo = type.value === 'video'
            getView()
      }else{
        if(map.player) {
          if ([1, 4, 10].includes(opts.video['vodPlatform'])) {
            map.player.destroy()
            map.player = null
          } else if (opts.video['vodPlatform'] === 2) {
            map.player.dispose()
            map.player = null
            $('#player').html('')
          }
        }
      }
    })
    onMounted(()=>{
      if(modelValue.value){
        ctrl.isVideo = type.value === 'video'
        getView()
      }
    })
    onUnmounted(()=>{
      if(map.player)
        if (opts.video['vodPlatform'] === 2) {
          map.player.destroy()
          map.player = null
        } else if (opts.video['vodPlatform'] === 3) {
          map.player.dispose()
          map.player = null
          $('#player').html('')
        }
    })
    return {
      opts,
      ctrl,
      modelValue,
      videoInfo,
      videoBox,
      t,
      cloneDialog
    }
  }
}
</script>

<style scoped>
.video_body_content{
  position: relative;
  width: 100%;
  min-height: 400px;
  overflow: hidden;
}
.win_box{
  display: flex;
  align-items: center;
  justify-content: center;
}
.video_content,.win_box,.video_win{
  width: 100%;
  height: 400px;
}
.video_win_img{
  height: 400px;
}

.dialog-footer{
  text-align: center;
}

</style>
