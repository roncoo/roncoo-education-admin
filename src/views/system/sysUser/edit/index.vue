<template>
  <el-dialog
    :title="title"
    :model-value="visible"
    width="600px"
    center
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录账号">
        <el-input v-model="info.mobile" class="form-group" disabled/>
      </el-form-item>
      <el-form-item label="用户昵称" prop="realName">
        <el-input v-model="form.realName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" class="form-group" maxlength="500" show-word-limit/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {sysUserEdit} from '@/api/system'

export default {
  name: 'EditSysUser',
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      form: {},
      rules: {
        sort: [
          {required: true, message: '请输入排序', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ]
      }
    }
  },
  emits: ['closes'],
  mounted() {
    this.form = this.info;
  },
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
      this.loading.show()
      // 编辑
      sysUserEdit(this.form).then(res => {
        this.loading.hide()
        this.$message.success(res, 'success')
        this.$emit('closes', 'success')
      }).catch(() => {
        this.loading.hide()
      })
    }
  }
}
</script>

