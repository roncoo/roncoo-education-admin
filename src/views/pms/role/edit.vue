<template>
  <!--弹窗-->
  <el-dialog
    width="500px"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="名称:" prop="roleName">
        <el-input v-model="formData.roleName" />
      </el-form-item>
      <el-form-item label="排序:">
        <el-input-number v-model="formData.sort" style="width: 300px;" :min="1" :max="10000" @change="handleChange" />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="formData.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="danger" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from '@/api/system'

export default {
  name: 'Edit',
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
  data() {
    return {
      rules: {
        roleName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$refs['formData'].resetFields()
      this.$emit('close-callback')
    },
    handleChange(value) {
      this.formData.sort = value
    },
    submitForm(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.formData.id === undefined) {
            this.$message({
              type: 'error',
              message: '更新失败'
            });
          }
          this.loading.show()
          api.roleUpdate(this.formData).then(res => {
            this.loading.hide()
            if (res.code === 200 && res.data > 0) {
              // 提交成功, 关闭窗口, 刷新列表
              this.tips('更新成功', 'success')
              this.handleClose()
            } else {
              this.$message({
                type: 'error',
                message: '更新失败'
              });
            }
          }).catch(() => {
            this.loading.hide()
          })
        } else {
          this.$message({
            type: 'error',
            message: '更新失败'
          });
        }
      })
    }
  }
}
</script>
