<template>
  <div class="login-layout">
    <div class="container">
      <img alt src="../../assets/images/login-logo2.jpg" class="login-logo2">
      <div class="login-panel">
        <!--        <div class="head clearfix">-->
        <!--          <div class="logo">-->
        <!--            <img alt src="" class="img-logo">-->
        <!--          </div>-->
        <!--        </div>-->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          auto-complete="on"
          label-position="left"
        >
          <h3 class="login-head">用户登录</h3>
          <el-form-item class="form-group" prop="loginNo">
            <el-input
              ref="loginNo"
              v-model="loginForm.loginNo"
              auto-complete="on"
              class="form-input"
              name="loginNo"
              placeholder="用户名"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item class="form-group" prop="loginPassword">
            <el-input
              ref="loginPassword"
              v-model="loginForm.loginPassword"
              :type="passwordType"
              auto-complete="on"
              class="form-input"
              name="loginPassword"
              placeholder="密码"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-button
            :loading="loading"
            class="submit-btn"
            style="width:100%;margin-bottom:30px;"
            type="primary"
            @click.native.prevent="handleLogin"
          >登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {login} from '@/api/login';
import { getToken, setToken } from '@/utils/auth'
export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录密码'))
      } else if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginNo: '',
        loginPassword: ''
      },
      loginRules: {
        loginNo: [{required: true, trigger: 'blur', validator: validateUsername}],
        loginPassword: [{required: true, trigger: 'blur', validator: validatePass}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          login(this.loginForm).then((res) => {
            console.log(res)
            setToken(res.data.token)
            this.$router.push({path: this.redirect || '/'})
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-layout {
  min-height: 100%;
  position: relative;
  min-width: 100%;
  background: url('../../assets/images/login-img.jpg') no-repeat center #2873f0;
  background-size: auto 100%;

  .container {
    position: fixed;
    width: 820px;
    height: 450px;
    left: 50%;
    top: 40%;
    margin: -225px 0 0 -410px;

    background: #FFFFFF;
    box-shadow: 0px 0px 26px #0051C4;
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
      img {
        width: 135px;
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
    padding-top: 89px;
    padding-bottom: 42px;
    font-weight: bold;
    font-size: 24px;
    line-height: 34px;
    color: #333333;
    margin: 0
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
    width: 300px;
    height: 44px;
    margin-top: 39px;
    background: #2388EC;
    border-radius: 22px;
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
    }

    .prn_icon {
      vertical-align: bottom;
    }
  }
}
</style>
