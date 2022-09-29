<template>
  <div class="login-layout">
    <div class="container">
      <img alt class="login-logo2" src="../../assets/images/login-logo.jpg"/>
      <div class="login-panel">
        <div class="head clearfix">
          <div class="logo">
            <img v-if="service.websiteLogo" :src="service.websiteLogo"/>
            <img v-else class="img-logo" src="../../assets/logo.svg"/>
          </div>
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
          <h3 class="login-head">管理员登录</h3>
          <el-form-item class="form-group" prop="mobile">
            <el-input ref="mobile" v-model="loginForm.mobile" auto-complete="on" class="form-input" name="mobile" placeholder="用户名" tabindex="1" type="text" @keyup.enter="handleLogin"/>
          </el-form-item>
          <el-form-item class="form-group" prop="mobilePwd">
            <el-input ref="mobilePwd" v-model="loginForm.mobilePwd" :type="mobilePwdType" auto-complete="on" class="form-input" name="mobilePwd" placeholder="密码" tabindex="2" @keyup.enter="handleLogin"/>
          </el-form-item>
          <el-form-item v-if="imageVerification" prop="imageVerification">
            <div class="flex_code">
              <el-input v-model="loginForm.imageVerification" class="flex_code_input" placeholder="请输入验证码" @keyup.enter="handleLogin"/>
              <img :src="imgCode" class="img_code" @click="getImgCode"/>
            </div>
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

<script>
// import slideVerify from '@/components/slideVerify'
import {getCodeImg, getWebsite} from '@/api/login';
import {getStore, setStore} from '@/utils/storage';
import {mapGetters} from 'vuex';

export default {
  name: 'Login',
  components: {
    // slideVerify
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录账号'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录密码'));
      } else if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    return {
      service: {
        websiteCopyright: '',
        websiteIcp: '',
        prnNo: '',
        websitePrn: ''
      },
      loginForm: {
        mobile: '13300000000',
        mobilePwd: '123456',
        imageVerification: '',
        imageVerificationToken: ''
      },
      loginRules: {
        mobile: [{required: true, trigger: 'blur', validator: validateMobile}],
        mobilePwd: [{required: true, trigger: 'blur', validator: validatePass}],
        imageVerification: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
      checkSlide: '',
      showSlide: false,
      loading: false,
      mobilePwdType: 'password',
      redirect: undefined,
      imgCode: '',
      errorCount: 0
    };
  },
  computed: {
    ...mapGetters(['imageVerification'])
  },
  mounted() {
    this.errorCount = parseInt(getStore('loginErrorCount')) || 0
    if (this.errorCount >= 2) {
      this.$store.dispatch('app/toggleImageVerification', true)
    }
    this.getWebsiteInfo();
    //this.getImgCode();
  },
  methods: {
    getImgCode() {
      getCodeImg().then((res) => {
        this.loginForm.imageVerificationToken = res.verToken;
        this.imgCode = res.img;
      });
    },
    getBrowserInfo: function() {
      /* eslint-disable */
      const Sys = {};
      const ua = navigator.userAgent.toLowerCase();
      let s;
      (s = ua.match(/rv:([\d.]+)\) like gecko/))
        ? (Sys.ie = s[1])
        : (s = ua.match(/msie ([\d]+)/))
          ? (Sys.ie = s[1])
          : (s = ua.match(/edge\/([\d]+)/))
            ? (Sys.edge = s[1])
            : (s = ua.match(/firefox\/([\d]+)/))
              ? (Sys.firefox = s[1])
              : (s = ua.match(/(?:opera|opr).([\d]+)/))
                ? (Sys.opera = s[1])
                : (s = ua.match(/chrome\/([\d]+)/))
                  ? (Sys.chrome = s[1])
                  : (s = ua.match(/version\/([\d]+).*safari/))
                    ? (Sys.safari = s[1])
                    : 0;
      // 根据关系进行判断
      if (Sys.ie) {
        return {
          name: 'IE',
          version: Sys.ie
        };
      }
      if (Sys.edge) {
        return {
          name: 'EDGE',
          version: Sys.edge
        };
      }
      if (Sys.firefox) {
        return {
          name: 'Firefox',
          version: Sys.firefox
        };
      }
      if (Sys.chrome) {
        return {
          name: 'Chrome',
          version: Sys.chrome
        };
      }
      if (Sys.opera) {
        return {
          name: 'Opera',
          version: Sys.opera
        };
      }
      if (Sys.safari) {
        return {
          name: 'Safari',
          version: Sys.safari
        };
      }
      return {
        name: 'Unkonwn',
        version: '0.0.0'
      };
    },
    // 获取系统信息
    getOsInfo: function() {
      const userAgent = navigator.userAgent.toLowerCase();
      let name = 'Unknown';
      let version = 'Unknown';
      if (userAgent.indexOf('win') > -1) {
        name = 'Windows';
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          version = 'Windows 2000';
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
          version = 'Windows XP';
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          version = 'Windows Vista';
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
          version = 'Windows 7';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
          version = 'Windows 8';
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          version = 'Windows 8.1';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
          version = 'Windows 10';
        } else {
          version = 'Unknown';
        }
      } else if (userAgent.indexOf('iphone') > -1) {
        name = 'Iphone';
      } else if (userAgent.indexOf('mac') > -1) {
        name = 'Mac';
      } else if (
        userAgent.indexOf('x11') > -1 ||
        userAgent.indexOf('unix') > -1 ||
        userAgent.indexOf('sunname') > -1 ||
        userAgent.indexOf('bsd') > -1
      ) {
        name = 'Unix';
      } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
          name = 'Android';
        } else {
          name = 'Linux';
        }
      } else {
        name = 'Unknown';
      }
      return {
        name,
        version
      };
    },
    handleCheck() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.showSlide = true;
        }
      });
    },
    slideSuccess() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch('user/getLoginSign', this.loginForm)
            .then((res) => {
              this.loginForm.sign = res.sign;
              this.loginForm.signatureNonce = res.signatureNonce;
              this.loginForm.timestamp = res.timestamp;
              this.loginForm = {...this.loginForm};
              this.handleLogin();
            })
            .catch(() => {
              this.showSlide = false;
            });
        }
      });
    },
    getWebsiteInfo() {
      getWebsite().then((res) => {
        if (res) {
          this.service = res;
        }
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {os: '', browser: '', osVersion: '', browserVersion: ''};
          const {name: osName, version: osVersion} = this.getOsInfo();
          const {name: browserName, version: browserVersion} = this.getBrowserInfo();
          params.os = osName;
          params.osVersion = osVersion;
          params.browser = browserName;
          params.browserVersion = browserVersion;
          this.$store.dispatch('user/login', {...this.loginForm, ...params}).then((res) => {
            setStore('loginErrorCount', 0)
            setStore('websiteLogo', this.service.websiteLogo)
            this.$store.dispatch('app/toggleImageVerification', false);
            this.$router.push({path: '/'});
            this.loading = false;
          }).catch((err) => {
            this.getImgCode()
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    }
  }
};
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
