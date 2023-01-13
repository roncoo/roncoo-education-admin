<template>
  <el-dialog :model-value="visible" :before-close="handleClose" :title="title" center width="600px">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="权限名称" class="form-group" prop="menuName">
        <el-input v-model="form.menuName" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="权限标识" class="form-group" prop="authValue">
        <el-input v-model="form.authValue" type="textarea" maxlength="500" show-word-limit/>
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
import {sysMenuEdit, sysMenuView} from '@/api/system';

export default {
  name: 'SysPermissionEdit',
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
      text: '',
      list: [''],
      rules: {
        menuName: [
          {required: true, message: '请输入权限名称', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序', trigger: 'blur'}
        ],
        authValue: [
          {required: true, message: '请输入权限标识', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.form = Object.assign(this.info)
    if (this.form.id) {
      sysMenuView(this.form.id).then(res => {
        this.form = {...res}
        this.list = res.authValueList
      })
    }
  },
  emits: ['closes'],

  methods: {
    addNode() {
      this.list.push('');
    },
    delNode(i) {
      this.list.splice(i, 1)
    },
    handleClose() {
      this.$emit('closes')
      this.form = {}
    },
    changeList(val) {
      let arr = val.split('|')
      arr.forEach(e => {
        e = e.replace(/\//g, ':');
        this.list.push(e)
      })
      this.text = ''
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
      sysMenuEdit(this.form).then(res => {
        this.loading.hide()
        this.$message.success(res, 'success');
        this.$emit('closes', this.form)
      }).catch(() => {
        this.loading.hide()
      })
    }
  }
}
</script>
<style scoped>
.icon {
  font-size: 24px;
  margin-top: 5px;
}

.hovblu {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.hovblu:hover {
  color: #5cb6ff;
}

.w90 {
  width: 89%;
  margin-right: 10px;
}
</style>
