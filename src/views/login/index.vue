<template>
  <div class="login-layout">
    <div class="container">
      <img alt class="login-logo2" src="../../assets/images/login-logo.jpg"/>
      <div class="login-panel">
        <div class="head clearfix">
          <div class="logo">
            <img alt="logo" src="@/assets/logo.svg"/>
          </div>
        </div>
        <el-form ref="loginForm" :model="loginForm" auto-complete="on" label-position="left">
          <h3 class="login-head">管理员登录</h3>
          <el-form-item class="form-group" prop="mobile">
            <el-input v-model="loginForm.mobile" auto-complete="on" class="form-input" name="mobile" placeholder="用户名" tabindex="1" type="text" @keyup.enter="handleLogin"/>
          </el-form-item>
          <el-form-item class="form-group" prop="mobilePwd">
            <el-input v-model="loginForm.mobilePwd" type="password" auto-complete="on" class="form-input" name="mobilePwd" placeholder="密码" tabindex="2" @keyup.enter="handleLogin"/>
          </el-form-item>
          <el-button :loading="loading" class="submit-btn" style="width: 100%; margin-bottom: 30px" type="primary" @click.native.prevent="handleLogin">登 录</el-button>
          <div>账号：18800000000/123456（需要本地部署）</div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div v-if="service.websiteCopyright" class="copyright">
        <span v-html="service.websiteCopyright"/>
      </div>
      <div class="icp">
        <a v-if="service.websiteIcp" class="c_ccc" href="http://beian.miit.gov.cn/" target="_blank">{{ service.websiteIcp }}</a>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <img :alt="service.websitePrn" class="prn_icon" src="@/assets/prn_icon.png"/>
        <a v-if="service.websitePrn" :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + service.websitePrnNo" class="c_ccc" target="_blank">&nbsp;{{ service.websitePrn }} </a>
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

function getImgCode() {
  loginApi.getCodeImg().then((res) => {
    this.loginForm.imageVerificationToken = res.verToken;
    this.imgCode = res.img;
  });
}

function handleCheck() {
  this.$refs.loginForm.validate((valid) => {
    if (valid) {
      this.showSlide = true;
    }
  });
}

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
    setToken(res.token)

    //更新用户信息到store
    await useUserStore().setUserInfo()
    //useUserStore().setMenuInfo()

    // todo 初始化路由
    router.push('/');
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss">
.login-layout {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background: #2873f0;

  .container {
    position: absolute;
    width: 820px;
    height: 520px;
    left: 50%;
    top: 42%;
    margin: -225px 0 0 -410px;
    background: #ffffff;
    box-shadow: 0px 0px 26px #0051c4;
    border-radius: 8px;
  }

  .login-logo2 {
    width: 450px;
    height: 520px;
    left: 532px;
    top: 120px;
    border-radius: 6px 0px 0px 6px;
  }

  .head {
    .logo {
      min-height: 67px;
      text-align: center;

      img {
        margin-top: 5%;
        width: 250px;
        vertical-align: top;
      }
    }

    .name-panel {
      float: left;
      color: #fff;
      padding-top: 18px;
    }

    .name {
      font-size: 26px;
      font-weight: 700;
      line-height: 1;
    }

    .tip {
      padding-top: 6px;
      margin: 0;
    }
  }

  .login-panel {
    box-sizing: initial;
    float: right;
    width: 300px;
    height: 420px;
    background: #fff;
    border-radius: 0 6px 6px 0;
    padding: 50px 35px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.55);
  }

  .login-head {
    padding-top: 60px;
    padding-bottom: 20px;
    font-weight: bold;
    font-size: 24px;
    line-height: 34px;
    color: #333333;
    margin: 0;
  }

  .form-group {
    height: 50px;
    border-bottom: 1px solid #e1e1e1;
    border-radius: 3px;
    margin-bottom: 20px;
    position: relative;
  }

  .form-group .label {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    line-height: 50px;
    height: 50px;
    font-size: 17px;
    text-align: center;
  }

  .form-group .form-input {
    box-sizing: border-box;
    height: 50px;

    input {
      border: none;
      height: 100%;
      width: 100%;
      padding: 0;
      box-sizing: border-box;
    }
  }

  .check-group .form-input {
    padding-left: 12px;
  }

  .check-group .check-img {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 105px;
    height: 30px;
  }

  .form-group .icon {
    width: 20px;
  }

  .check-slide-group {
    overflow: visible;
    transition: border 0.5s;

    .tip-text {
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      z-index: 9;
      line-height: 50px;
      text-align: center;
    }

    .el-form-item__error {
      position: absolute;
      left: 0;
      right: 0;
      top: 52px;
    }

    &.error {
      border-color: #f56c6c;
    }

    &.success {
      border-color: #67c23a;
    }

    &:hover {
      border-color: #333;
      cursor: pointer;
    }
  }

  .slide-panel-head {
    line-height: 42px;
  }

  .slide-panel {
    background-color: #fff;
    position: absolute;
    left: -15px;
    bottom: 10px;
    z-index: 99;
    padding: 0 10px 10px;
    border: 1px solid #eee;
    box-shadow: 0 0 5px #aaa;

    .arrow {
      position: absolute;
      bottom: -9px;
      left: 50%;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 8px;
      margin-left: -3px;
      border-bottom-width: 0;
      border-top-color: #dbdcde;

      &:after {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        content: ' ';
        border-width: 8px;
        border-color: transparent;
        border-style: solid;
        top: -9px;
        margin-left: -8px;
        border-bottom-width: 0;
        border-top-color: #fff;
      }
    }

    .refresh-btn {
      color: #409eff;
    }
  }

  .submit-btn {
    margin-top: 20px;
    width: 300px;
    height: 44px;
    background: #2388ec;
    border-radius: 22px;

    &:active {
      opacity: 0.6;
    }
  }

  .copyright {
    text-align: center;
    color: #fff;
    padding-bottom: 12px;
  }

  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 20px;
    font-size: 13px;

    .icp {
      text-align: center;
      color: #fff;
      line-height: 17px;
    }

    .prn_icon {
      vertical-align: bottom;
    }
  }
}

.flex_code {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .flex_code_input {
    margin-right: 10px;
    min-width: 50px !important;
  }
}

.img_code {
  width: 80px;
  cursor: pointer;
}
</style>
