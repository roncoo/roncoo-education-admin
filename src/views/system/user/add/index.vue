<template>
  <el-dialog :before-close="handleClose" :model-value="visible" :title="title" center width="600px">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录账号" prop="mobile">
        <el-input v-model="form.mobile" class="form-group" maxlength="11" show-word-limit/>
      </el-form-item>
      <el-form-item label="登录密码" prop="mobilePwd">
        <el-input v-model="form.mobilePwd" class="form-group" type="password"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input v-model="form.rePassword" class="form-group" type="password"/>
      </el-form-item>
      <el-form-item label="用户昵称" prop="realName">
        <el-input v-model="form.realName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" class="form-group" maxlength="500" show-word-limit type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {systemApi} from '@/api/system'

export default {
  name: 'AddSysUser',
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validaterePassword = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.mobilePwd !== value) {
          callback(new Error('登录密码和确认密码不一致'));
        }
        callback();
      }
    };
    return {
      form: {},
      opts: {},
      rules: {
        realName: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入登录账号', trigger: 'blur'}
        ],
        mobilePwd: [
          {required: true, message: '请输入登录密码', trigger: 'blur'}
        ],
        rePassword: [
          {required: true, validator: validaterePassword, trigger: 'blur'}
        ]
      }
    }
  },
  emits: ['closes'],
  methods: {
    handleClose() {
      this.form = {};
      this.$emit('closes');
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
      // 新增
      systemApi.sysUserSave(this.form).then(res => {
        this.$message.success(res, 'success');
        this.$emit('closes', 'success')
      }).catch(() => {
      })
    }
  }
}
</script>

