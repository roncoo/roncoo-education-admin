<template>
  <el-button :disabled="ctrl.disabled" :size="size" type="primary" @click="handleLogin">
    {{ ctrl.text }}
  </el-button>
</template>

<script>
  import * as system from '@/api/system'
  import { isPhoneNo } from '@/utils/validate'
  export default {
    name: 'CodeButton',
    props: {
      text: {
        type: String,
        default: '发送验证码'
      },
      phone: {
        type: [Number, String],
        default: 'token'
      },
      type: {
        type: [Number, String],
        default: 5
      },
      size: {
        type: [Number, String],
        default: undefined
      }
    },
    data() {
      return {
        ctrl: {
          disabled: false,
          text: this.text
        }
      }
    },
    methods: {
      handleLogin() {
        if (isPhoneNo(this.phone)) {
          // this.$emit('callback')
          // this.ctrl.disabled = true
          // system.sendPhoneCode({ phone: this.phone }).then(res => {
          //   this.tips('发送成功', 'success')
          //   this.ctrl.disabled = true
          //   let num = 60
          //   this.ctrl.text = num + 's'
          //   const sin = setInterval(() => {
          //     if (num <= 0) {
          //       clearInterval(sin)
          //       this.ctrl.text = this.text
          //       this.ctrl.disabled = false
          //     } else {
          //       num--
          //       this.ctrl.text = num + 's'
          //     }
          //   }, 1000)
          // }).catch(() => {
          //   this.ctrl.disabled = false
          // })
        } else {
          this.tips('请输入正确手机号码')
        }
      }
    }
  }
</script>

<style scoped>

</style>
