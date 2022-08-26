<template>
  <el-dialog
    :before-close="handleClose"
    :title="title"
    :visible.sync="visible"
    width="600px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" class="form-group" maxlength="50" show-word-limit />
      </el-form-item>
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
import {usersEdit} from '@/api/user';

export default {
  name: 'UsersEdit',
  props: {
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
      title: '编辑用户',
      form: {
        allowDelete: true
      },
      rules: {
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序值', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.form = this.info
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
      // 编辑
      usersEdit(this.form).then(res => {
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
