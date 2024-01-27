<template>
  <el-dialog
      :before-close="handleClose"
      :model-value="visible"
      :title="title"
      center
      width="600px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" class="form-group" maxlength="500" show-word-limit type="textarea"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" controls-position="right"/>
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
import {systemApi} from '@/api/system.js'

export default {
  name: 'EditSysRole',
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
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        sort: [
          {required: false, message: '请输入排序值', trigger: 'blur'}
        ]
      }
    }
  },
  emits: ['closes'],
  mounted() {
    this.form = this.info
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

      // 编辑
      systemApi.sysRoleEdit(this.form).then(res => {

        this.$message.success(res, 'success');
        this.$emit('closes', 'success')
      }).catch(() => {

      })
    }
  }
}
</script>
