<template>
  <el-dialog :model-value="visible" :before-close="handleClose" :title="title" center width="600px">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item v-if="info.menuName" label="菜单名称" prop="menuName">
        <el-input v-model="info.menuName" class="form-group" disabled/>
      </el-form-item>
      <el-form-item label="权限名称" prop="menuName">
        <el-input v-model="form.menuName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="权限标识" prop="authValue">
        <el-input v-model="form.authValue" class="form-group" maxlength="100" show-word-limit/>
      </el-form-item>
      <!--
      <el-form-item label="权限认证值">
        <el-input v-model="text" class="w90" placeholder="这里可以批量添加，请使用|分隔" type="textarea" @change="changeList"></el-input>
      </el-form-item>
      <el-form-item v-for="(v,i) in list" :key="i" ref="options" label="权限认证值">
        <el-input v-model="list[i]" class="w90"/>
        <img alt="" class="hovblu" src="@/assets/images/add.png" @click="addNode">
        <img v-if="list.length > 1" alt="" class="hovblu" src="@/assets/images/delete.png" @click="delNode(i)">
      </el-form-item>
      -->
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
import {sysPermissionSave} from '@/api/system';

export default {
  name: 'SysPermissionAdd',
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
      form: {
        sort: 100
      },
      text: '',
      list: [''],
      rules: {
        menuName: [
          {required: true, message: '请输入权限名称', trigger: 'blur'}
        ],
        authValue: [
          {required: true, message: '请输入权限标识', trigger: 'blur'}
        ]
      }
    };
  },
  mounted() {
    this.form.parentId = this.info.menuId
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
      this.$emit('closes');
      this.form = {};
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
          this.form.authValueList = this.list
          const d = {
            ...this.form
          };
          d.authValueList = d.authValueList.filter(i => i && i.trim())
          d.authValueList.forEach((item, index, arr) => {
            arr[index] = item.replace(/\//g, ':')
          })
          d.authValue = d.authValue.replace(/\//g, ':');
          if (d.menuName.indexOf(';') !== -1) {
            d.menuName = d.menuName.split(';');
          } else if (d.menuName.indexOf('|') !== -1) {
            d.menuName = d.menuName.split('|');
          } else {
            d.menuName = d.menuName;
          }
          if (d.authValue.indexOf(';') !== -1) {
            d.authValue = d.authValue.split(';');
          } else if (d.authValue.indexOf('|') !== -1) {
            d.authValue = d.authValue.split('|');
          } else {
            d.authValue = d.authValue;
          }
          this.onSubmit(d);
        } else {
          return false;
        }
      });
    },
    onSubmit(d) {
      this.loading.show()
      // 新增
      d.menuType = 3
      d.outLink = 0
      sysPermissionSave(d)
        .then((res) => {
          this.loading.hide();
          this.$message.success(res, 'success');
          this.$emit('closes', this.form);
        })
        .catch(() => {
          this.loading.hide();
        });
    }
  }
};
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
