<template>
  <div class="container">
    <div class="login">
      <div class="login-info">
        <p class="title">欢迎登录 领课教育系统（开源版）</p>
        <p class="info">
          领课教育系统（roncoo-education）是基于领课网络多年的在线教育平台开发和运营经验打造出来的产品，致力于打造一个各行业都适用的分布式在线教育系统。系统采用前后端分离模式，前台采用vue.js为核心框架，后台采用Spring Cloud为核心框架。系统目前主要功能有课程点播功能，支持多家视频云的接入，课程附件管理功能，支持多家存储云的接入，可以帮助个人或者企业快速搭建一个轻量级的在线教育平台。
        </p>
      </div>
      <div class="login-panel">
        <el-form ref="loginForm" :model="loginForm" auto-complete="on" label-position="left">
          <h3 class="login-head">管理员登录</h3>
          <el-form-item class="form-group" prop="mobile">
            <el-input v-model="loginForm.mobile" auto-complete="on" class="form-input" name="mobile" placeholder="用户名" tabindex="1" type="text" @keyup.enter="handleLogin"/>
          </el-form-item>
          <el-form-item class="form-group" prop="mobilePwd">
            <el-input v-model="loginForm.mobilePwd" type="password" auto-complete="on" class="form-input" name="mobilePwd" placeholder="密码" tabindex="2" @keyup.enter="handleLogin"/>
          </el-form-item>
          <el-button class="login-button" v-loading="loading" type="primary" @click.native.prevent="handleLogin">登 录</el-button>
          <div class="tip">账号：18800000000/123456（需要本地部署）</div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div v-if="service.websiteCopyright" class="copyright">
        <span v-html="service.websiteCopyright"/>
      </div>
      <div>
        <a v-if="service.websiteIcp" href="http://beian.miit.gov.cn/" target="_blank">{{ service.websiteIcp }}</a>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <img v-if="service.websitePrn" :alt="service.websitePrn" src="@/assets/images/common/beian.png"/>
        <a v-if="service.websitePrn" :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + service.websitePrnNo" target="_blank">&nbsp;{{ service.websitePrn }} </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {loginApi} from '@/api/login';
import {ref, reactive, onMounted} from 'vue';
import {setToken} from '@/utils/cookie';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/store/modules/user';
import {Discount} from '@element-plus/icons-vue';

const router = useRouter();
const loading = ref(false)

const service = ref({
  websiteLogo: '',
  websiteCopyright: '',
  websiteIcp: '',
  prnNo: '',
  websitePrn: ''
})
const loginForm = reactive({
  mobile: '13300000000',
  mobilePwd: '123456'
})

onMounted(() => {
  getWebsite()
})

async function getWebsite() {
  let res = await loginApi.getWebsite();
  service.value = res;
}

async function handleLogin() {
  loading.value = true
  try {
    const res = await loginApi.login(loginForm)
    // 存入cookie
    setToken(res.token)
    // 更新store
    await useUserStore().login(res)
    // 初始化路由
    await router.push('/');
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: #2873f0;
}

.login {
  position: absolute;
  top: calc((100vh - 520px) / 2);
  left: 0;
  right: 0;
  width: 800px;
  margin: 0 auto;

  .login-info {
    float: left;
    width: 350px;
    padding: 25px;
    height: 450px;
    color: #fff;
    background: #033c94;
    border-radius: 12px 0 0 12px;

    .title {
      font-size: 20px;
      font-weight: 700;
    }

    .info {
      font-size: 15px;
      font-weight: 300;
      line-height: 25px;
    }
  }

  .login-panel {
    float: right;
    background: #fff;
    height: 450px;
    width: 350px;
    padding: 25px;
    border-radius: 0 12px 12px 0;

    .login-head {
      text-align: center;
      font-size: 28px;
      font-weight: 700;
    }

    .login-button {
      width: 350px;
      height: 50px;
      background: #2873f0;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      color: #fff;
      line-height: 50px;
      cursor: pointer;
    }

    .tip {
      margin-top: 10px;
      font-size: 14px;
    }
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  text-align: center;
  padding-bottom: 20px;
  font-size: 13px;

  a {
    text-decoration: none;
    color: #fff;
  }
}

</style>
