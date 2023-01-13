<template>
  <el-dialog
    :model-value="visible"
    :before-close="handleClose"
    width="450px"
    title="修改密码"
  >
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="手 机 号" prop="password">
        <el-input v-model="phone" disabled/>
      </el-form-item>
      <div class="form-mobile-group">
        <el-form-item label="验 证 码" prop="password" class="form-input auto-width">
          <el-input v-model="form.code" class="auto-width" placeholder="请输入短信验证码"/>
        </el-form-item>
        <code-button :type="4" :size="'small'" style="width: 126px;"/>
      </div>
      <el-form-item label="新 密 码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword" required>
        <el-input v-model="form.checkPassword" type="password" placeholder="请再次输入新密码"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </span>
    </template>

  </el-dialog>

</template>

<script>
import * as system from '@/api/system'
import CodeButton from '@/components/CodeButton/index.vue'
import {checkPWD} from '@/utils/validate'

export default {
  name: 'ResetPassword',
  components: {CodeButton},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value || value.length < 8 || value.length > 30) {
        callback(new Error('密码长度为8~30位字符'))
      } else if (checkPWD(value) !== 3) {
        callback(new Error('密码必须包含（数字，字母，特殊字符）'))
      } else {
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (!!value && value.toString() === this.form.newPassword) {
        callback();
      } else {
        callback(new Error('两次输入的新密码不一致!'));
      }
    }
    return {
      phone: this.$store.getters.name,
      form: {
        newPassword: undefined,
        checkPassword: undefined
      },
      rules: {
        newPassword: [{required: true, trigger: 'blur', validator: validatePass}],
        checkPassword: [
          {required: true, trigger: 'blur', message: '请再次输入密码'},
          {validator: checkPassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close-callback');
    },
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // this.loading.show('正在发起请求···');
          // system.resetPassword(this.form.newPassword, this.form.code).then(res => {
          //     this.$store.dispatch('LogOut').then(() => {
          //         this.loading.hide()
          //         this.$alert('编辑成功，请重新登录').then(() => {
          //             location.reload()
          //         }).catch(() => {
          //             location.reload()
          //         })
          //     })
          // }).catch(() => {
          //     this.loading.hide()
          // })
        } else {
          console.log('error submit');
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.form-mobile-group {
  .form-input {
    display: inline-block;
    width: 230px;
    margin-right: 8px;
  }

  .form-btn {
    width: 150px;
  }
}
</style>
