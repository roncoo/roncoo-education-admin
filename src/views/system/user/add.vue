<template>
  <el-dialog
    :before-close="handleClose"
    :title="title"
    :visible.sync="visible"
    width="600px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录账号" prop="loginNo">
        <el-input v-model="form.loginNo" class="form-group" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="登录密码" prop="loginPassword">
        <el-input v-model="form.loginPassword" class="form-group" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" class="form-group" type="password" />
      </el-form-item>
      <!--      <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname" class="form-group" maxlength="50" show-word-limit />
            </el-form-item>-->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" class="form-group" maxlength="500" show-word-limit type="textarea" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" controls-position="right" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {usersSave} from '@/api/user';

export default {
  name: 'UsersAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateLoginPassword = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('请输入密码'));
      } else {
        const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.$@$!%*#?&])[A-Za-z\d.$@$!%*#?&]{8,20}$/;
        if (new RegExp(reg).test(value) === false) {
          callback(new Error('至少包含英文、数字、特殊字符($@$!%*#?&)，长度8-20'));
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
      title: '添加用户',
      form: {
        allowDelete: 1,
        sort: 100
      },
      rules: {
        loginNo: [
          {required: true, message: '请输入登录账号', trigger: 'blur'}
        ],
        loginPassword: [
          {validator: validateLoginPassword, trigger: 'blur'}
        ],
        confirmPassword: [
          {validator: validateConfirmPassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
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
      usersSave(this.form).then(res => {
        this.loading.hide()
        this.tips(res.data, 'success');
        this.handleClose();
      }).catch(() => {
        this.loading.hide()
      })
    },
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>

</style>
