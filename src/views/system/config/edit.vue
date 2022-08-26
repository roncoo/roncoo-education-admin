<template>
  <el-dialog
    :before-close="handleClose"
    :title="title"
    :visible.sync="visible"
    width="600px"
  >
    <el-form ref="form" :model="newFormData" :rules="rules">
      <el-form-item prop="configValue">
        <!-- 文本类型 -->
        <el-input v-model="newFormData.configValue" :rows="2" placeholder="请输入内容" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('newFormData')">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {configEdit} from '@/api/system'

export default {
  name: 'EditConfig',
  components: {},
  props: {
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
      newFormData: {},
      rules: {
        configValue: [
          {required: true, message: '请输入参数键值', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.newFormData = {...this.formData}
  },
  methods: {
    handleClose() {
      this.$emit('close-callback')
    },
    submitForm(formName) {
      if (!this.newFormData.configValue) {
        this.$message({
          type: 'error',
          message: '值不能为空'
        });
        return false
      }
      this.onSubmit()
    },
    onSubmit() {
      this.loading.show()
      // 编辑
      configEdit({configKey: this.newFormData.configKey, configValue: this.newFormData.configValue}).then(res => {
        this.loading.hide()
        this.tips(res.data, 'success');
        this.$emit('close-callback', 'success')
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
