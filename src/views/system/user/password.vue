<template>
  <el-dialog
    :before-close="handleClose"
    :title="title"
    :visible.sync="visible"
    width="600px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录密码" prop="loginPassword">
        <el-input v-model="form.loginPassword" class="form-group" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" class="form-group" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {usersPassword} from '@/api/user';

export default {
  name: 'UsersPassword',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateLoginPassword = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('请输入密码'));
      } else {
        const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.$@$!%*#?&])[A-Za-z\d.$@$!%*#?&]{8,20}$/;
        if (new RegExp(reg).test(value) === false) {
          callback(new Error('登录密码至少包含 数字和英文，长度6-20'));
        }
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.loginPassword !== value) {
          callback(new Error('登录密码和确认密码不一致'));
        }
        callback();
      }
    };
    return {
      title: '重置密码',
      form: {},
      rules: {
        loginPassword: [
          {required: true, validator: validateLoginPassword, trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, validator: validateConfirmPassword, trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.form.id = this.id;
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          return false;
        }
      })
    },
    onSubmit() {
      this.loading.show()
      // 新增
      usersPassword(this.form).then(res => {
        this.loading.hide()
        this.tips(res.data, 'success');
        this.handleClose();
      }).catch(() => {
        this.loading.hide()
      })
    }
  }
}
</script>

<style scoped>

</style>
