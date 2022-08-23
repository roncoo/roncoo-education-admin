<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="400px">
    <el-form ref="formData" :model="formData" label-width="40px">
      <el-form-item label="" prop="remark">
        <el-input v-model="formData.remark" class="form-group" type="textarea" :rows="4" placeholder="请输入内容" maxlength="50" show-word-limit/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="danger" plain plain @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as orderApi from '@/api/order'

export default {
  name: 'Remark',
  props: {
    // route object
    formData: {
      type: Object,
      default: () => {
      }
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
  methods: {
    submitForm(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.formData.id === undefined) {
            this.$message({
              type: 'error',
              message: "提交失败"
            });
          } else {
            this.loading.show()
            orderApi.orderUpdate(this.formData).then(res => {
              this.loading.hide()
              if (res.code === 200 && res.data > 0) {
                // 提交成功, 关闭窗口, 刷新列表
                this.tips('操作成功', 'success')
                this.handleClose()
              } else {
                this.$message({
                  type: 'error',
                  message: "提交失败"
                });
              }
            }).catch(() => {
              this.loading.hide()
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: "提交失败"
          });
        }
      })
    },
    handleClose(done) {
      this.$emit('close-callback')
    }
  }
}
</script>

