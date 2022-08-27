<template>
  <!--弹窗-->
  <el-dialog
    width="500px"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="新密码：" prop="mobilePsw">
        <el-input v-model="formData.mobilePsw" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码：" prop="rePwd">
        <el-input v-model="formData.rePwd" placeholder="请输入确认密码" show-password />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="danger" plain @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from '@/api/system'
export default {
  name: 'Add',
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newUser: 1,
      check: 1,
      ctrl: {
        addDialogVisible: true
      },
      rules: {
        mobilePsw: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        rePwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 关闭弹窗
    handleClose(done) {
      this.$refs['formData'].resetFields()
      this.$emit('close-callback')
    },
    // 更新管理员密码
    submitForm(formData) {
      if (!this.formData.mobilePsw) {
        this.$message({
          type: 'error',
          message: '请输入新密码'
        });
        return false
      }
      if (!this.formData.rePwd) {
        this.$message({
          type: 'error',
          message: '请输入确认密码'
        });
        return false
      }
      if (this.formData.mobilePsw !== this.formData.rePwd) {
        this.$message({
          type: 'error',
          message: '两次输入密码不一致'
        });
        return false
      }
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.loading.show()
          // 更新管理员密码
          api.updatePassword(this.formData).then(res => {
            this.loading.hide()
            if (res.code === 200 && res.data > 0) {
              // 提交成功, 关闭窗口, 刷新列表
              this.tips('成功', 'success')
              this.$emit('close-callback')
            } else {
              this.$message({
                type: 'error',
                message: '提交失败'
              });
            }
          }).catch(() => {
            this.loading.hide()
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败'
          });
        }
      })
    }
  }
}
</script>
<style scoped>
